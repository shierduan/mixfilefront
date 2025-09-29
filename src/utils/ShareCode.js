import basex from 'base-x'
import * as JsCrypto from "jscrypto";
import {copyText, substringAfter} from "./CommonUtils.jsx";
import {apiAddress} from "../config.js";

const replaceMap = {}

for (let i = 0xfe00; i <= 0xfe0f; i++) {
    const hex = (i - 0xfe00).toString(16)
    replaceMap[hex] = String.fromCodePoint(i)
}

function encodeHex(result) {
    for (const key in replaceMap) {
        result = result.replaceAll(key, replaceMap[key])
    }
    return result
}

function decodeHex(content) {
    content = [...content].filter((it) => Object.values(replaceMap).includes(it)).join("").trim()
    for (const key in replaceMap) {
        content = content.replaceAll(replaceMap[key], key)
    }
    return content
}

function hex2a(hex) {
    hex = hex.toString();
    let str = '';
    for (let i = 0; i < hex.length; i += 2)
        str += String.fromCharCode(parseInt(hex.substring(i, i + 2), 16));
    return str;
}

const mixBase = basex('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ')

function hexToArrayBuffer(hex) {
    const bytes = new Uint8Array(hex.length / 2);
    for (let i = 0; i < hex.length; i += 2) {
        bytes[i / 2] = parseInt(hex.substring(i, 2), 16);
    }
    return bytes.buffer;
}

// 工具函数：将 ArrayBuffer 转换为字符串
function arrayBufferToStr(buffer) {
    const decoder = new TextDecoder();
    return decoder.decode(buffer);
}

function bufferToHex(buffer) {
    return Array.from(buffer)
        .map(byte => byte.toString(16).padStart(2, '0'))
        .join('')
}


const keyHex = "202cb962ac59075b964b07152d234b70"

// 解密函数
function decryptAESGCM(encryptedData, iv, authTag) {
    try {
        // 1. 转换 key
        const key = JsCrypto.Hex.parse(keyHex);

        // 2. 转换 iv 和密文
        const ivParsed = JsCrypto.Hex.parse(bufferToHex(iv));
        const cipherParsed = JsCrypto.Hex.parse(bufferToHex(encryptedData));

        const tagLength = authTag.length;

        // 3. 解密
        const decryptedData = JsCrypto.AES.decrypt(
            {
                cipherText: cipherParsed
            },
            key,
            {
                iv: ivParsed,
                padding: JsCrypto.pad.NoPadding,
                mode: JsCrypto.mode.GCM
            }
        );

        // 4. 验证认证标签
        const computedTag = JsCrypto.mode.GCM.mac(
            JsCrypto.AES,
            key,
            ivParsed,
            null,        // 如果有 AAD，可传 Uint8Array 或字符串
            cipherParsed,
            tagLength
        );

        // // 转换 authTag 为 hex 字符串比较
        const authTagHex = bufferToHex(authTag)
        if (computedTag.toString() !== authTagHex) {
            throw new Error("认证标签验证失败！");
        }
        // 5. 返回明文字符串
        return decryptedData.toString(JsCrypto.Utf8);
    } catch (error) {
        console.error("解密失败:", error);
        throw error;
    }
}

// 工具函数：从数据中提取 IV 和加密数据
function extractIvAndData(dataBuffer) {
    const ivLength = 12; // AES-GCM 的 IV 通常是 12 字节
    const tagLength = 12; // AES-GCM 的认证标签通常是 16 字节

    // 提取 IV（前 12 字节）
    const iv = dataBuffer.slice(0, ivLength);

    // 提取认证标签（最后 16 字节）
    const authTag = dataBuffer.slice(dataBuffer.length - tagLength);

    // 提取加密数据（IV 之后到认证标签之前）
    const encrypted = dataBuffer.slice(ivLength, dataBuffer.length - tagLength);

    return {iv, encrypted, authTag};
}


export function decodeMixFileRaw(data) {
    data = decodeMixShareCode(data)
    const encData = mixBase.decode(data)
    if (!encData) {
        return null
    }
    const {iv, encrypted, authTag} = extractIvAndData(encData);
    const dData = decryptAESGCM(encrypted, iv, authTag)
    try {
        return JSON.parse(dData)
    } catch (e) {
        console.error(e)
    }
}

window.mixfile = decodeMixFile

export function decodeMixFile(shareInfo) {
    try {
        const code = decodeMixShareCode(shareInfo.trim())
        const {f, s, h, u, k, r} = decodeMixFileRaw(code)
        return {
            fileName: f,
            fileSize: s,
            headSize: h,
            url: u,
            key: k,
            referer: r,
            code,
        }
    } catch (e) {
        console.error("解密失败:", e);
    }
    return {}
}

export function decodeMixShareCode(str) {
    str = str.trim()
    let result = hex2a(decodeHex(str)) || str
    return substringAfter(result, '://')
}

export function getShareCodeUrl(code) {
    const {fileName} = decodeMixFile(code)
    return `${apiAddress}api/download/${encodeURIComponent(fileName)}?s=${decodeMixShareCode(code)}`
}

export function copyShareCode(code) {
    copyText(`mf://${decodeMixShareCode(code)}`)
}

