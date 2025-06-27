import basex from 'base-x'
import forge from 'node-forge'

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

function hex2a(hexx) {
    const hex = hexx.toString();//force conversion
    let str = '';
    for (let i = 0; i < hex.length; i += 2)
        str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
    return str;
}

const mixBase = basex('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ')

function hexToArrayBuffer(hex) {
    const bytes = new Uint8Array(hex.length / 2);
    for (let i = 0; i < hex.length; i += 2) {
        bytes[i / 2] = parseInt(hex.substr(i, 2), 16);
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


// 解密函数
function decryptAESGCM(encryptedData, iv, authTag) {
    try {

        encryptedData = forge.util.createBuffer(encryptedData)
        iv = forge.util.createBuffer(iv)
        authTag = forge.util.createBuffer(authTag)


        // 将输入数据转换为 forge 缓冲区格式
        const keyBytes = forge.util.hexToBytes('202cb962ac59075b964b07152d234b70'); // 密钥 (16 字节 = 128 位)


        // 创建 AES-GCM 解密器
        const decipher = forge.cipher.createDecipher('AES-GCM', keyBytes);

        // 设置 IV
        decipher.start({
            iv: iv,
            tag: authTag, // GCM 模式需要提供认证标签,
            tagLength: 96
        });

        // 解密密文
        decipher.update(forge.util.createBuffer(encryptedData));

        // 完成解密并验证
        const pass = decipher.finish();

        if (pass) {
            // 解密成功，返回明文
            return decipher.output.toString('utf8');
        }
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

export function decodeMixFile(data) {
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
        console.log(e)
    }
}

export function decodeMixFileName(shareInfo) {
    try {
        const {f, s, h, u, k, r} = decodeMixFile(shareInfo)
        return {
            fileName: f,
            fileSize: s,
            headSize: h,
            url: u,
            key: k,
            referer: r,
        }
    } catch (e) {
        console.error("解密失败:", e);
    }
    return {}
}


export function decodeMixShareCode(str) {
    let result = hex2a(decodeHex(str)) || str
    if (result.startsWith('mf://')) {
        result = result.substring(5)
    }
    return result
}


