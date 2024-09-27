import {useState} from 'react';
import styled from "styled-components";
import {Backdrop, Button} from "@mui/material";
import {apiAddress} from "../config.js";
import {CopyToClipboard} from "react-copy-to-clipboard/src";
import {notifyMsg} from "../utils/CommonUtils.js";

const Container = styled.div`
    display: flex;
    background-color: white;
    padding: 10px;
    border-radius: 10px;
    justify-content: center;
    width: 500px;
    max-width: 95vw;
    flex-wrap: wrap;
    gap: 10px;
    flex-direction: column;
    color: #8e2afe;
    word-break: break-all;

    button {
        font-size: max(.6rem, 14px);
    }
`

let setGdata = null

function FileDialog(props) {
    const [data, setData] = useState(null)
    setGdata = setData
    if (data == null) {
        return null
    }
    const {name, size, shareInfoData} = data

    const downloadAddress = `${apiAddress}/api/download?s=${encodeURIComponent(shareInfoData)}`

    return (
        <Backdrop open onClick={(event) => {
            if (event.target === event.currentTarget) {
                setGdata(null)
            }
        }} style={{
            zIndex: '99'
        }}>
            <Container className={'shadow'}>
                <h3>文件: {name}</h3>
                <CopyToClipboard text={`mf://${shareInfoData}`} onCopy={() => {
                    notifyMsg('复制成功!')
                }}>
                    <Button variant={'outlined'}>复制分享码</Button>
                </CopyToClipboard>
                <CopyToClipboard text={downloadAddress} onCopy={() => {
                    notifyMsg('复制成功!')
                }}>
                    <Button variant={'outlined'}>复制局域网地址</Button>
                </CopyToClipboard>
                <Button variant={'contained'} onClick={() => {
                    window.open(downloadAddress)
                }}>下载/预览文件(图片视频右键另存为保存)</Button>
            </Container>
        </Backdrop>
    );
}

export function openFileDialog(file) {
    setGdata(file)
}

export default FileDialog;
