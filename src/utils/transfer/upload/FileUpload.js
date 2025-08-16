import {Semaphore} from "@chriscdn/promise-semaphore";
import {apiAddress, client} from "../../../config.js";
import {formatFileSize, noProxy} from "../../CommonUtils.jsx";
import {proxy} from "valtio";
import {CanceledError} from "axios";

export const uploadFileList = proxy([])

export function isUploading() {
    return uploadFileList.some((it) => !it.complete)
}

export function purgeUploadFileList() {
    if (!isUploading()) {
        uploadFileList.length = 0
    }
}

export function uploadingCount() {
    return uploadFileList.filter((it) => !it.complete).length
}

window.addEventListener('beforeunload', function (event) {
    if (isUploading()) {
        event.preventDefault()
        const msg = '文件正在上传中,是否确认关闭?'
        event.returnValue = msg
        return msg
    }
})


export function cancelAllUpload() {
    uploadFileList.forEach(file => {
        file?.cancel?.();
    })
    uploadFileList.length = 0
}


export function addUploadFile(
    files,
    getPath = (file) => `${apiAddress}api/upload?name=${encodeURIComponent(file.name)}`
) {

    purgeUploadFileList()

    files.forEach(async (file) => {
        const upFile = proxy({
            url: getPath(file),
            file: noProxy(file),
            result: null,
            complete: false,
            error: false,
            tip: '',
            progress: 0,
            title: file.name,
            cancel: null,
        })

        uploadFileList.push(upFile)
        await uploadFile(upFile)
    })

}

const semaphore = new Semaphore(2)

export async function uploadFile(
    upFile,
) {

    const controller = new AbortController();

    const {file, url} = upFile;

    upFile.tip = '等待中'
    upFile.cancel = () => {
        controller.abort()
    }
    await semaphore.acquire()

    upFile.tip = `上传中: 0/${formatFileSize(file.size)}`

    try {
        let response = await client.put(url, file, {
            onUploadProgress: progressEvent => {
                const {loaded, total} = progressEvent
                upFile.tip = `上传中: ${formatFileSize(loaded, true)}/${formatFileSize(total)}`
                upFile.progress = loaded / total * 100
            },
            signal: controller.signal
        })
        upFile.result = response?.data

    } catch (e) {
        upFile.error = true
        if (e instanceof CanceledError) {
            upFile.tip = '上传已取消'
            return
        }
        console.error(e)
        upFile.tip = '上传失败: ' + (e?.response?.data?.message || e.message || '未知错误')
        return
    } finally {
        upFile.complete = true
        semaphore.release()
    }
    upFile.progress = 100
    upFile.tip = `上传成功 ${formatFileSize(file.size)}`
}
