import styled from "styled-components";
import {FileDrop} from "react-file-drop";
import {apiAddress} from "../config.js";
import axios from "axios";
import {toast} from "react-toastify";
import {setProgressState} from "./ProgressDialog.jsx";
import {formatFileSize, notifyMsg} from "../utils/CommonUtils.js";
import {openFileDialog} from "./FileDialog.jsx";

const Container = styled.div`
    display: flex;
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

async function uploadFile(file) {
    const uploadAddress = `${apiAddress}api/upload?name=${encodeURIComponent(file.name)}`
    setProgressState({
        open: true,
        tip: `上传中: 0/${formatFileSize(file.size)}`,
        progress: 0,
        title: file.name
    })
    const controller = new AbortController();
    let response = null
    try {
        response = await axios.put(uploadAddress, file, {
            onUploadProgress: progressEvent => {
                const {loaded, total} = progressEvent
                setProgressState({
                    open: true,
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
        openFileDialog({
            name: file.name,
            size: file.size,
            shareInfoData: response.data
        })
    } catch (e) {
        if (e.message === 'canceled') {
            return
        }
        toast.error(`上传失败: ${e?.message}`, {
            position: "top-center"
        });
        return
    } finally {
        setProgressState({
            open: false,
        })
    }
    notifyMsg('上传成功!')
}

function FileUpload(props) {
    return (
        <Container>
            <input type="file" id={'select-file'} hidden onChange={(event) => {
                uploadFile(event.target.files[0])
                event.target.value = ''
            }}/>
            <FileDrop
                onTargetClick={() => {
                    document.querySelector('#select-file').click()
                }}
                onDrop={(files, event) => {
                    uploadFile(files[0])
                }}
            >
                选择/拖入文件
            </FileDrop>
        </Container>
    );
}

export default FileUpload;
