import {Button} from "@mui/material";
import {UploadFileCard} from "./UploadFileCard.jsx";
import {notifyMsg} from "../../CommonUtils.jsx";
import {dialogList} from "../../DialogContainer.jsx";
import {useSnapshot} from "valtio";
import {showConfirmWindow} from "../../../components/common/ConfirmWindow.jsx";
import {cancelAllUpload, isUploading, uploadFileList} from "./FileUpload.js";
import {TransferDialog} from "../components/TransferDialog.jsx";


function UploadDialog() {

    const fileList = useSnapshot(uploadFileList)

    const results = fileList.filter(file => file.result !== null)

    const uploaded = results.length

    const errorCount = fileList.filter(file => file.error).length

    const complete = !isUploading()

    if (fileList.length === 0) {
        return (
            <TransferDialog className={'shadow'}>
                <h3 className={'animate__animated animate__bounceIn'}>
                    当前没有文件正在上传
                </h3>
                <Button variant={'outlined'} onClick={() => {
                    dialogList.pop()
                }}>关闭</Button>
            </TransferDialog>
        )
    }

    let title = <h3>{uploaded} / {fileList.length} 个文件正在上传</h3>

    if (complete) {
        title = (
            <h3 className={'animate__animated animate__bounceIn'}>
                {fileList.length} 个文件全部上传成功
            </h3>
        )
    }

    if (errorCount > 0) {
        title = (
            <h3 className={'animate__animated animate__bounceIn'}>
                {uploaded} / {fileList.length} 个文件上传中 {errorCount} 个文件上传失败
            </h3>
        )
        if (complete) {
            title = (
                <h3 className={'animate__animated animate__bounceIn'}>
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
                    dialogList.pop()
                })
            }}>取消全部上传</Button>
        )
    }

    return (
        <TransferDialog className={'shadow'}>
            {
                title
            }
            <div class="content">
                {
                    uploadFileList.map((file, index) =>
                        <UploadFileCard file={file} key={index}/>
                    )
                }
            </div>
            {
                cancelButton
            }

            <Button variant={'outlined'} onClick={() => {
                dialogList.pop()
            }}>关闭</Button>
        </TransferDialog>

    );
}

export default UploadDialog;
