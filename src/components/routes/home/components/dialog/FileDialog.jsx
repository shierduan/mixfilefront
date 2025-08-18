import {Button} from "@mui/material";
import {copyText, formatFileSize} from "../../../../../utils/CommonUtils.jsx";
import DialogDiv from "../../../../common/base/DialogDiv.jsx";
import {copyShareCode, getShareCodeUrl} from "../../../../../utils/ShareCode.js";


function FileDialog({data}) {

    const {name, size, shareInfoData} = data

    const downloadAddress = getShareCodeUrl(shareInfoData)

    return (
        <DialogDiv className={'shadow'}>

            <h3 className={'text-hide'}>文件: {name}</h3>

            <p>{formatFileSize(size ?? 0)}</p>

            <Button variant={'outlined'} onClick={() => {
                copyShareCode(shareInfoData)
            }}>
                复制分享码
            </Button>

            <Button variant={'outlined'} onClick={() => {
                copyText(downloadAddress)
            }}>
                复制局域网地址
            </Button>

            <Button variant={'contained'} onClick={() => {
                window.open(downloadAddress)
            }}>
                下载/预览文件(图片视频右键另存为保存)
            </Button>
        </DialogDiv>
    );
}


export default FileDialog;
