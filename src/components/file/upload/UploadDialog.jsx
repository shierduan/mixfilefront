import {useState} from 'react';
import styled from "styled-components";
import {Button} from "@mui/material";
import {ProgressCard} from "./UploadCard.jsx";
import {getFormattedDate, notifyMsg} from "../../../utils/CommonUtils.js";
import {CopyToClipboard} from "react-copy-to-clipboard/src";
import {apiAddress} from "../../../config.js";
import axios from "axios";
import pako from "pako";
import {openFileListDialog} from "../FileList.jsx";
import {addDialog, dialogProxy} from "../../../utils/DialogContainer.jsx";
import {proxy, ref, useSnapshot} from "valtio";

const Container = styled.div`
    display: flex;
    background-color: white;
    padding: 10px;
    border-radius: 10px;
    justify-content: center;
    width: 500px;
    max-width: 95vw;
    gap: 10px;
    flex-direction: column;
    color: #8e2afe;
    word-break: break-all;

    > .content {
        gap: 10px;
        display: flex;
        flex-direction: column;
        max-height: 60vh;
        overflow-y: auto;
    }

    p {
        white-space: nowrap;
        font-weight: bold;
    }

    button {
        font-size: max(.6rem, 14px);
    }
`

export const uploadFileList = proxy([])


export function addUploadFile(...files) {
    files.forEach((file) => {
        uploadFileList.push({
            file: ref(file),
            result: null,
            complete: false,
            error: false,
            tip: '',
            progress: 0,
            title: file.name,
            cancel: null,
        })
    })
    addDialog(<UploadDialog/>, false)
}


function UploadDialog() {

    const fileList = useSnapshot(uploadFileList)

    const [uploading, setUploading] = useState(false)

    const results = fileList.filter(file => file.result !== null)

    const uploaded = results.length
    const errorCount = fileList.filter(file => file.error).length
    const complete = fileList.filter(file => file.complete).length === fileList.length

    let title = <h3>{uploaded} / {fileList.length} 个文件正在上传</h3>
    if (complete) {
        title = (
            <h3 className={'file-card animate__animated animate__bounceIn'}>
                {fileList.length} 个文件全部上传成功
            </h3>
        )
    }

    if (errorCount > 0) {
        title = (
            <h3 className={'file-card animate__animated animate__bounceIn'}>
                {uploaded} / {fileList.length} 个文件上传中 {errorCount} 个文件上传失败
            </h3>
        )
        if (complete) {
            title = (
                <h3 className={'file-card animate__animated animate__bounceIn'}>
                    {uploaded} / {fileList.length} 个文件上传成功 {errorCount} 个文件上传失败
                </h3>
            )
        }
    }

    return (
        <Container className={'shadow'}>
            {
                title
            }
            <div class="content">
                {
                    uploadFileList.map((file, index) =>
                        <ProgressCard file={file} key={index}/>
                    )
                }
            </div>
            {
                results.length > 0 &&
                <>
                    <CopyToClipboard
                        className={'file-card animate__animated animate__bounceIn'}
                        text={results.map((it) => it.result).join('\n')}
                        onCopy={() => {
                            notifyMsg('复制成功!')
                        }}>
                        <Button variant={'outlined'}>全部复制</Button>
                    </CopyToClipboard>
                </>
            }

            {
                results.length > 1 &&
                <Button disabled={uploading} variant={'contained'} onClick={async () => {
                    const dataList = results.map(({file, result}) => {
                        return {
                            name: file.name,
                            size: file.size,
                            category: '',
                            time: new Date().getTime(),
                            shareInfoData: result
                        }
                    })
                    const shareData = pako.gzip(JSON.stringify(dataList))
                    const uploadAddress = `${apiAddress}api/upload?name=${encodeURIComponent(`文件分享-${getFormattedDate()}.mix_list`)}&add=false`
                    setUploading(true)
                    let response = await axios.put(uploadAddress, shareData, {})
                    openFileListDialog(response.data)
                    setUploading(false)
                }}>{'一键导出'}</Button>
            }

            <Button variant={'contained'} onClick={() => {
                notifyMsg('上传已取消')
                dialogProxy.pop()
                uploadFileList.length = 0
            }}>{complete ? '关闭' : '取消'}</Button>
        </Container>

    );
}

export default UploadDialog;
