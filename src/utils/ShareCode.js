import basex from 'base-x'

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
const key = '202cb962ac59075b964b07152d234b70'

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

async function getCryptoKeyFromHEX(md5Hex) {
    const keyBuffer = hexToArrayBuffer(md5Hex);
    return await crypto.subtle.importKey(
        "raw",
        keyBuffer,
        {name: "AES-GCM"},
        false,
        ["decrypt"]
    );
}

// 解密函数
async function decryptAESGCM(encryptedData, iv, md5Key = key) {
    try {
        // 获取密钥
        const key = await getCryptoKeyFromHEX(md5Key);

        // 解密
        const decrypted = await crypto.subtle.decrypt(
            {
                name: "AES-GCM",
                iv: iv,
                tagLength: 12 * 8
            },
            key,
            encryptedData
        );

        // 将解密结果转换回字符串
        return arrayBufferToStr(decrypted);
    } catch (error) {
        console.error("解密失败:", error);
        throw error;
    }
}

// 工具函数：从数据中提取 IV 和加密数据
function extractIvAndData(dataBuffer) {
    const iv = dataBuffer.slice(0, 12); // AES-GCM 的 IV 通常是 12 字节
    const encrypted = dataBuffer.slice(12); // 剩余部分是加密数据
    return {iv, encrypted};
}

export async function decodeMixFile(data) {
    data = decodeMixShareCode(data)
    const encData = mixBase.decode(data)
    if (!encData) {
        return null
    }
    const {iv, encrypted} = extractIvAndData(encData);
    const dData = (await decryptAESGCM(encrypted, iv, key)).toString()
    try {
        return JSON.parse(dData)
    } catch (e) {
        console.log(e)
    }
}

export async function decodeMixFileName(shareInfo) {
    return (await decodeMixFile(shareInfo))?.f
}


export function decodeMixShareCode(str) {
    let result = hex2a(decodeHex(str)) || str
    if (result.startsWith('mf://')) {
        result = result.substring(5)
    }
    return result
}


