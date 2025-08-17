import {useSnapshot} from "valtio";
import {Button} from "@mui/material";
import {dialogList} from "../../DialogContainer.jsx";
import {showConfirmWindow} from "../../../components/common/ConfirmWindow.jsx";
import {notifyMsg, run} from "../../CommonUtils.jsx";
import {cancelAllDownload, downloadFileList, downloadingCount, isDownloading} from "./FileDownload.js";
import {TransferDialog} from "../components/TransferDialog.jsx";
import {DownloadFileCard} from "./DownloadFileCard.jsx";

function DownloadDialog(props) {

    useSnapshot(downloadFileList);

    const fileList = downloadFileList;

    const errorCount = fileList.filter(file => file.error).length
    const downloading = downloadingCount()

    const complete = !isDownloading()

    if (fileList.length === 0) {
        return (
            <TransferDialog className={'shadow'}>
                <h3 className={'animate__animated animate__bounceIn'}>
                    当前没有文件正在下载
                </h3>
                <Button variant={'outlined'} onClick={() => {
                    dialogList.pop()
                }}>关闭</Button>
            </TransferDialog>
        )
    }


    const title = run(() => {
        if (errorCount > 0) {
            if (complete) {
                return (
                    <h3 className={'animate__animated animate__bounceIn'}>
                        {downloading} / {fileList.length} 个文件下载成功 {errorCount} 个文件下载失败
                    </h3>
                )
            }
            return (
                <h3 className={'animate__animated animate__bounceIn'}>
                    {downloading} / {fileList.length} 个文件下载中 {errorCount} 个文件下载失败
                </h3>
            )
        }
        if (complete) {
            return (
                <h3 className={'animate__animated animate__bounceIn'}>
                    {fileList.length} 个文件全部下载成功
                </h3>
            )
        }
        return <h3>{downloading} / {fileList.length} 个文件正在下载</h3>
    })


    const cancelButton = run(() => {
        if (!complete) {
            return (
                <Button variant={'contained'} onClick={() => {
                    showConfirmWindow('确认取消下载?', () => {
                        notifyMsg('下载已取消')
                        cancelAllDownload()
                        dialogList.pop()
                    })
                }}>取消全部下载</Button>
            )
        }
        return null
    })


    return (
        <TransferDialog className={'shadow'}>
            {
                title
            }
            <div class="content">
                {
                    downloadFileList.map((file, index) =>
                        <DownloadFileCard file={file} key={index}/>
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

export default DownloadDialog;