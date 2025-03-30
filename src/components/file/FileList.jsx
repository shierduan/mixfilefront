import styled from "styled-components";
import {useEffect, useState} from "react";
import {apiAddress} from "../../config.js";
import {Button, CircularProgress} from "@mui/material";
import axios from "axios";
import pako from "pako";
import {FileCard} from "./FileHistory.jsx";
import {notifyMsg} from "../../utils/CommonUtils.js";
import {CopyToClipboard} from "react-copy-to-clipboard/src";
import {addDialog} from "../../utils/DialogContainer.jsx";

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

    > .content {
        gap: 10px;
        display: flex;
        flex-direction: column;
        max-height: 60vh;
        overflow-y: auto;
    }

    button {
        font-size: max(.6rem, 14px);
    }
`


function FileListDialog({data}) {

    const downloadAddress = `${apiAddress}api/download?s=${data}`

    const [fileList, setList] = useState([])
    // console.log(fileList)

    useEffect(() => {
        setList([]);
        (async () => {
            const fileData = (await axios.get(downloadAddress, {
                responseType: 'arraybuffer'
            })).data
            const decoder = new TextDecoder('utf-8');
            const originalRaw = pako.ungzip(fileData)
            setList(JSON.parse(decoder.decode(originalRaw)))
        })()
    }, [data]);

    if (fileList.length === 0) {
        return <CircularProgress/>
    }

    return (
        <Container className={'shadow'}>
            <h3>共{fileList.length}个文件</h3>
            <div class="content">
                {fileList.map((item) => {
                    return <FileCard item={item} key={item.shareInfoData}/>
                })}
            </div>
            <CopyToClipboard text={`mf://${data}`} onCopy={() => {
                notifyMsg('复制成功!')
            }}>
                <Button variant={'outlined'}>复制分享码</Button>
            </CopyToClipboard>
            <Button variant={'contained'} onClick={() => {
                window.open(`${apiAddress}api/download?s=${encodeURIComponent(data)}`)
            }}>下载列表文件</Button>
        </Container>
    );
}

export function openFileListDialog(file) {
    addDialog(<FileListDialog data={file}/>)
}

export default FileListDialog;