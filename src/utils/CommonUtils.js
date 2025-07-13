import {toast} from "react-toastify";
import moment from "moment";
import axios from "axios";
import pako from "pako";
import {apiAddress} from "../config.js";

const debounceMap = {}

export function debounce(key, fn, delay) {
    if (debounceMap[key]) {
        clearTimeout(debounceMap[key])
    }
    debounceMap[key] = setTimeout(fn, delay)
}

export function notifyMsg(msg, options) {
    toast(msg, options)
}

export function notifyError(msg, options) {
    toast.error(msg, options)
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

export function getFormattedDate() {
    return moment().format('YYYY-MM-DD HH:mm:ss');
}

export async function fetchMixGzipTextData(code) {
    const downloadAddress = `${apiAddress}api/download?s=${code}`
    const fileData = (await axios.get(downloadAddress, {
        responseType: 'arraybuffer'
    })).data
    const decoder = new TextDecoder('utf-8');
    const originalRaw = pako.ungzip(fileData)
    return decoder.decode(originalRaw)
}