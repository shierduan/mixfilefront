import {Button} from "@mui/material";
import {apiAddress} from "../../../../../config.js";
import {CopyToClipboard} from "react-copy-to-clipboard/src";
import {formatFileSize, notifyMsg} from "../../../../../utils/CommonUtils.js";
import DialogDiv from "../../../../common/DialogDiv.jsx";


function FileDialog({data}) {

    const {name, size, shareInfoData} = data

    const downloadAddress = `${apiAddress}api/download/${encodeURIComponent(name)}?s=${encodeURIComponent(shareInfoData)}`

    return (
        <DialogDiv className={'shadow'}>
            <h3 className={'text-hide'}>文件: {name}</h3>
            <p>{formatFileSize(size ?? 0)}</p>
            <CopyToClipboard text={`mf://${shareInfoData}`} onCopy={() => {
                notifyMsg('复制成功!', {toastId: 'copy-to-clipboard'})
            }}>
                <Button variant={'outlined'}>复制分享码</Button>
            </CopyToClipboard>
            <CopyToClipboard text={downloadAddress} onCopy={() => {
                notifyMsg('复制成功!', {toastId: 'copy-to-clipboard'})
            }}>
                <Button variant={'outlined'}>复制局域网地址</Button>
            </CopyToClipboard>
            <Button variant={'contained'} onClick={() => {
                window.open(downloadAddress)
            }}>下载/预览文件(图片视频右键另存为保存)</Button>
        </DialogDiv>
    );
}


export default FileDialog;
