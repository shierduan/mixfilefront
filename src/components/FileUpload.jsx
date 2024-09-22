import styled from "styled-components";
import {FileDrop} from "react-file-drop";
import {apiAddress} from "../config.js";
import axios from "axios";
import {formatFileSize, notifyMsg} from "../utils/CommonUtils.js";
import {addFileList} from "./upload/UploadDialog.jsx";
import Semaphore from "@chriscdn/promise-semaphore";

const Container = styled.div`
    display: flex;
    flex-wrap: wrap;
    width: 100%;
    height: 100px;
    align-items: center;
    justify-content: center;
    font-size: 2rem;
    cursor: pointer;
    color: blueviolet;
    font-weight: bold;
    border: 4px dashed rgba(142, 42, 254, 0.63);
    transition: .3s;
    box-shadow: 0 0 5px 3px rgba(138, 43, 226, 0.15);
    word-break: break-all;

    &:hover {
        background-color: rgba(138, 43, 226, 0.1);
    }

    .file-drop {
        width: 100%;
        height: 100%;
    }

    .file-drop-target {
        filter: drop-shadow(2px 2px 4px rgba(174, 107, 239, 0.2));
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 100%;
        transition: .3s;
    }

    .file-drop-target.file-drop-dragging-over-frame {
        /* overlay a black mask when dragging over the frame */
        border: none;
        background-color: rgba(138, 43, 226, 0.1);
        z-index: 50;
        opacity: 1;
    }

    .file-drop-target.file-drop-dragging-over-target {
        /* turn stuff orange when we are dragging over the target */
        color: blueviolet;
        box-shadow: 0 0 13px 3px blueviolet;
    }
`

const semaphore = new Semaphore(2)

export async function uploadFile(file, setData) {
    const controller = new AbortController();
    const uploadAddress = `${apiAddress}api/upload?name=${encodeURIComponent(file.name)}`
    setData({
        tip: `等待中`,
        progress: 0,
        title: file.name,
        cancel() {
            controller.abort()
        }
    })
    await semaphore.acquire()
    console.log('await')
    setData({
        tip: `上传中: 0/${formatFileSize(file.size)}`,
        progress: 0,
        title: file.name,
        cancel() {
            controller.abort()
        }
    })
    try {
        await axios.put(uploadAddress, file, {
            onUploadProgress: progressEvent => {
                const {loaded, total} = progressEvent
                setData({
                    tip: `上传中: ${formatFileSize(loaded, true)}/${formatFileSize(total)}`,
                    progress: loaded / total * 100,
                    title: file.name,
                    cancel() {
                        controller.abort()
                        notifyMsg('上传已取消')
                    }
                })
            },
            signal: controller.signal
        })
    } catch (e) {
        setData({
            error: true,
            tip: `上传失败`,
            progress: 0,
            title: file.name
        })
        if (e.message === 'canceled') {
        }
        return
    } finally {
        semaphore.release()
    }
    setData({
        tip: `上传完成`,
        progress: 100,
        title: file.name
    })
}

function FileUpload(props) {
    return (
        <Container>
            <input type="file" id={'select-file'} hidden onChange={(event) => {
                addFileList(event.target.files)
                event.target.value = ''
            }} multiple="multiple"/>
            <FileDrop
                onTargetClick={() => {
                    document.querySelector('#select-file').click()
                }}
                onDrop={(files, event) => {
                    addFileList(files)
                }}
            >
                选择/拖入文件
            </FileDrop>
        </Container>
    );
}

export default FileUpload;
