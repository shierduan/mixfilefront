import {proxy} from "valtio";
import Semaphore from "@chriscdn/promise-semaphore";
import {formatFileSize, saveBlob} from "../../CommonUtils.jsx";
import {client} from "../../../config.js";
import {CanceledError} from "axios";

export const downloadFileList = proxy([])

export function isDownloading() {
    return downloadFileList.some((it) => !it.complete)
}

export function purgeDownloadFileList() {
    if (!isDownloading()) {
        downloadFileList.length = 0
    }
}

export function downloadingCount() {
    return downloadFileList.filter((it) => !it.complete).length
}

window.addEventListener('beforeunload', function (event) {
    if (isDownloading()) {
        event.preventDefault()
        const msg = '文件正在下载中,是否确认关闭?'
        event.returnValue = msg
        return msg
    }
})


export function cancelAllDownload() {
    downloadFileList.forEach(file => {
        file?.cancel?.();
    })
    downloadFileList.length = 0
}

export function addDownloadFile(
    url,
    name
) {

    purgeDownloadFileList()

    const dFile = proxy({
        url,
        complete: false,
        error: false,
        tip: '',
        progress: 0,
        title: name,
        cancel: null,
    })

    downloadFileList.push(dFile)

    downloadFile(dFile)

}

const semaphore = new Semaphore(2)

export async function downloadFile(
    dFile,
) {

    const controller = new AbortController();

    const {url} = dFile;

    dFile.tip = '等待中'
    dFile.cancel = () => {
        controller.abort()
    }
    await semaphore.acquire()

    dFile.tip = `开始下载...`

    try {
        let response = await client.get(url, {
            onDownloadProgress: progressEvent => {
                const {loaded, total} = progressEvent
                dFile.tip = `下载中: ${formatFileSize(loaded, true)}/${formatFileSize(total)}`
                dFile.progress = loaded / total * 100
            },
            signal: controller.signal,
            responseType: 'blob', // 确保以二进制格式下载
        })
        if (!response) {
            return
        }

        saveBlob(response.data, dFile.title)

    } catch (e) {
        dFile.error = true
        if (e instanceof CanceledError) {
            dFile.tip = '下载已取消'
            return
        }
        console.error(e)
        dFile.tip = '下载失败: ' + (e?.response?.data?.message || e.message || '未知错误')
        return
    } finally {
        dFile.complete = true
        semaphore.release()
    }

    dFile.progress = 100
    dFile.tip = `下载成功`
}

