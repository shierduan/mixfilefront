import {useSnapshot} from "valtio";
import {purgeUploadFileList, uploadFileList, uploadingCount} from "../../../utils/upload/FileUpload.js";
import {CircularProgress} from "@mui/material";
import styled from "styled-components";
import {addDialog} from "../../../utils/DialogContainer.jsx";
import UploadDialog from "../../../utils/upload/UploadDialog.jsx";

const Container = styled.div`
    .content {
        cursor: pointer;
        width: 100%;
        padding: 10px 10px;
        display: flex;
        gap: 10px;
        position: fixed;
        top: 60px;
        align-items: center;
        color: rgba(112, 3, 193, 0.68);
        font-weight: bold;
        background-color: rgba(195, 144, 252, 0.33);
        z-index: 998;
    }
`

function UploadTipBar(props) {

    useSnapshot(uploadFileList)

    const count = uploadingCount()

    let tip = null

    if (count > 0) {
        tip = (
            <div class="content shadow animate__animated animate__slideInDown" onClick={() => {
                addDialog(<UploadDialog/>)
            }}>
                <CircularProgress size={20}/>
                {count} 个文件正在上传中
            </div>
        )
    }

    return (
        <Container>
            {tip}
        </Container>
    );
}

export default UploadTipBar;