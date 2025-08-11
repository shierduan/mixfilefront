import moment from "moment";
import pako from "pako";
import {apiAddress, client} from "../config.js";
import {proxy} from "valtio";
import {watch} from "valtio/utils";
import copy from "copy-to-clipboard";
import toast from "react-hot-toast";
import {CircularProgress} from "@mui/material";

const debounceMap = {}

export function debounce(key, fn, delay) {
    if (debounceMap[key]) {
        clearTimeout(debounceMap[key])
    }
    debounceMap[key] = setTimeout(fn, delay)
}

export function notifyMsg(msg, options) {
    return toast.success(msg, options)
}

export function notifyError(msg, options) {
    return toast.error(msg, options)
}

export function notifyPromise(promise, msg, options) {
    return toast.promise(promise, {loading: msg}, {icon: <CircularProgress size={20}/>, ...options})
}


export function formatFileSize(bytes, mb) {
    if (bytes === 0) return '0 B';
    if (mb && bytes > 1024 * 1024) {
        return (bytes / (1024 * 1024)).toFixed(2) + ' MB'
    }
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    const formattedSize = parseFloat((bytes / Math.pow(1024, i)).toFixed(2));
    return `${formattedSize} ${sizes[i]}`;
}

export function getFormattedDate(date) {
    return moment(date).format('YYYY-MM-DD HH:mm:ss');
}

export async function fetchMixGzipTextData(code) {
    const downloadAddress = `${apiAddress}api/download?s=${code}`
    const fileData = (await client.get(downloadAddress, {
        responseType: 'arraybuffer'
    })).data
    const decoder = new TextDecoder('utf-8');
    const originalRaw = pako.ungzip(fileData)
    return decoder.decode(originalRaw)
}

export function parseMixGzipText(data) {
    const decoder = new TextDecoder('utf-8');
    const originalRaw = pako.ungzip(data)
    return decoder.decode(originalRaw)
}

/**
 * 生成一个带有更新参数的新 URL（不会修改浏览器地址）
 * @param {Object} params - 需要更新的参数
 * @returns {string} - 更新后的 URL 字符串
 */
export function getParamUrl(params) {
    const url = new URL(window.location.href);
    const searchParams = url.searchParams;

    Object.entries(params).forEach(([key, value]) => {
        if (value === null || value === undefined) {
            searchParams.delete(key);
        } else {
            searchParams.set(key, value.toString());
        }
    });

    // 返回完整 URL
    return url.toString();
}

export function reverseSort(compareFn) {
    return (a, b) => compareFn(b, a); // 反转 a 和 b 的位置
}

export function updateURLParams(params, replace = false) {

    const newUrl = getParamUrl(params);

    if (newUrl !== window.location.href) {
        const {history} = window;
        if (replace) {
            history.replaceState(null, '', newUrl);
        } else {
            history.pushState(null, '', newUrl);
        }
        window.dispatchEvent(new PopStateEvent('popstate', {state: history.state}));
    }
}

export function copyText(text) {
    copy(text)
    notifyMsg('复制成功')
}


export function getURLParam(key) {
    const url = new URL(window.location.href);
    return url.searchParams.get(key);
}

export function paramProxy(defaults) {
    const state = proxy({})

    function syncFromURL() {
        for (const key in defaults) {
            const val = getURLParam(key)
            state[key] = val ?? defaults[key]
        }
    }

    // 初始化：从 URL 读入状态
    syncFromURL()

    watch((get) => {

        const value = get(state)
        const params = {}
        for (const key in value) {
            params[key] = String(value[key])
        }
        updateURLParams(params)
    })

    // 添加 popstate 监听器
    window.addEventListener('popstate', () => {
        syncFromURL()
    })

    return state
}

function extractNumber(str, start) {
    let result = 0;
    let i = start;
    while (i < str.length && /\d/.test(str[i])) {
        result = result * 10 + (str.charCodeAt(i) - 48);
        i++;
    }
    return result;
}

export function compareByName(a, b) {
    let i1 = 0, i2 = 0;
    while (i1 < a.length && i2 < b.length) {
        if (/\d/.test(a[i1]) && /\d/.test(b[i2])) {
            const n1 = extractNumber(a, i1);
            const n2 = extractNumber(b, i2);
            i1 += n1.toString().length;
            i2 += n2.toString().length;
            if (n1 !== n2) return n1 - n2;
        } else {
            if (a[i1] !== b[i2]) return a[i1].charCodeAt(0) - b[i2].charCodeAt(0);
            i1++;
            i2++;
        }
    }
    return a.length - b.length;
}