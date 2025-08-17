import {useSnapshot} from "valtio";
import {uploadFileList, uploadingCount} from "../../../utils/transfer/upload/FileUpload.js";
import {CircularProgress} from "@mui/material";
import styled from "styled-components";
import {addDialog} from "../../../utils/DialogContainer.jsx";
import UploadDialog from "../../../utils/transfer/upload/UploadDialog.jsx";
import {downloadFileList, downloadingCount} from "../../../utils/transfer/download/FileDownload.js";
import DownloadDialog from "../../../utils/transfer/download/DownloadDialog.jsx";
import {run} from "../../../utils/CommonUtils.jsx";

const Container = styled.div`
    > .content {
        width: 100%;
        padding: 0 10px;
        display: flex;
        height: 40px;
        gap: 10px;
        position: fixed;
        align-items: center;
        color: rgba(112, 3, 193, 0.68);
        font-weight: bold;
        background-color: rgba(195, 144, 252, 0.33);
        z-index: 998;
        top: 60px;

        > .upload {
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 10px;
        }

    }


`

function TransferTipBar(props) {

    useSnapshot(uploadFileList)
    useSnapshot(downloadFileList)

    const uploadCount = uploadingCount()
    const downloadCount = downloadingCount()


    const tip = run(() => {
        if (uploadCount > 0 || downloadCount > 0) {
            const uploadTip = run(() => {
                if (uploadCount > 0) {
                    return (
                        <div class="upload" onClick={() => {
                            addDialog(<UploadDialog/>)
                        }}>
                            {uploadCount} 个文件正在上传中
                        </div>
                    )
                }
                return null
            })

            const downloadTip = run(() => {
                if (downloadCount > 0) {
                    return (
                        <div class="upload" onClick={() => {
                            addDialog(<DownloadDialog/>)
                        }}>
                            {downloadCount} 个文件正在下载中
                        </div>
                    )
                }
                return null
            })

            return (
                <div class="content shadow animate__animated animate__slideInDown">
                    <CircularProgress size={20}/>
                    {uploadTip} {downloadTip}
                </div>
            )
        }
        return null
    })


    return (
        <Container>
            {tip}
        </Container>
    );
}

export default TransferTipBar;