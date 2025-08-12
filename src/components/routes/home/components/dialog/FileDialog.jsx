import {Button} from "@mui/material";
import {apiAddress} from "../../../../../config.js";
import {copyText, formatFileSize} from "../../../../../utils/CommonUtils.jsx";
import DialogDiv from "../../../../common/DialogDiv.jsx";


function FileDialog({data}) {

    const {name, size, shareInfoData} = data

    const downloadAddress = `${apiAddress}api/download/${encodeURIComponent(name)}?s=${encodeURIComponent(shareInfoData)}`

    return (
        <DialogDiv className={'shadow'}>
            <h3 className={'text-hide'}>文件: {name}</h3>
            <p>{formatFileSize(size ?? 0)}</p>
            <Button variant={'outlined'} onClick={() => {
                copyText(`mf://${shareInfoData}`)
            }}>复制分享码</Button>
            <Button variant={'outlined'} onClick={() => {
                copyText(downloadAddress)
            }}>复制局域网地址</Button>

            <Button variant={'contained'} onClick={() => {
                window.open(downloadAddress)
            }}>下载/预览文件(图片视频右键另存为保存)</Button>
        </DialogDiv>
    );
}


export default FileDialog;
