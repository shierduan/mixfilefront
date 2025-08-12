import styled from "styled-components";
import {Button} from "@mui/material";
import {ProgressCard} from "./UploadCard.jsx";
import {notifyMsg} from "../CommonUtils.jsx";
import {dialogProxy} from "../DialogContainer.jsx";
import {useSnapshot} from "valtio";
import {showConfirmWindow} from "../../components/common/ConfirmWindow.jsx";
import {cancelAllUpload, isUploading, uploadFileList} from "./FileUpload.js";

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


function UploadDialog() {

    const fileList = useSnapshot(uploadFileList)


    const results = fileList.filter(file => file.result !== null)

    const uploaded = results.length

    const errorCount = fileList.filter(file => file.error).length

    const complete = !isUploading()

    if (fileList.length === 0) {
        return (
            <Container className={'shadow'}>
                <h3 className={'components-card animate__animated animate__bounceIn'}>
                    当前没有文件正在上传
                </h3>
                <Button variant={'outlined'} onClick={() => {
                    dialogProxy.pop()
                }}>{'关闭'}</Button>
            </Container>
        )
    }

    let title = <h3>{uploaded} / {fileList.length} 个文件正在上传</h3>

    if (complete) {
        title = (
            <h3 className={'components-card animate__animated animate__bounceIn'}>
                {fileList.length} 个文件全部上传成功
            </h3>
        )
    }

    if (errorCount > 0) {
        title = (
            <h3 className={'components-card animate__animated animate__bounceIn'}>
                {uploaded} / {fileList.length} 个文件上传中 {errorCount} 个文件上传失败
            </h3>
        )
        if (complete) {
            title = (
                <h3 className={'components-card animate__animated animate__bounceIn'}>
                    {uploaded} / {fileList.length} 个文件上传成功 {errorCount} 个文件上传失败
                </h3>
            )
        }
    }

    let cancelButton = null

    if (!complete) {
        cancelButton = (
            <Button variant={'contained'} onClick={() => {
                showConfirmWindow('确认取消上传?', () => {
                    notifyMsg('上传已取消')
                    cancelAllUpload()
                    dialogProxy.pop()
                })
            }}>{'取消全部上传'}</Button>
        )
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
                cancelButton
            }

            <Button variant={'outlined'} onClick={() => {
                dialogProxy.pop()
            }}>{'关闭'}</Button>
        </Container>

    );
}

export default UploadDialog;
