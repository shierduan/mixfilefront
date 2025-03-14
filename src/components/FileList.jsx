import styled from "styled-components";
import {useEffect, useState} from "react";
import {apiAddress} from "../config.js";
import {Backdrop, Button, CircularProgress} from "@mui/material";
import axios from "axios";
import pako from "pako";
import {FileCard} from "./FileHistory.jsx";
import {notifyMsg} from "../utils/CommonUtils.js";
import {CopyToClipboard} from "react-copy-to-clipboard/src";

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

let setGdata = null

function FileListDialog(props) {
    const [data, setData] = useState(null)
    setGdata = setData

    if (data == null) {
        return null
    }

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
        return <Backdrop open><CircularProgress/></Backdrop>
    }

    return (
        <Backdrop open onClick={(event) => {
            if (event.target === event.currentTarget) {
                setGdata(null)
            }
        }} style={{
            zIndex: '99'
        }}>
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

            </Container>
        </Backdrop>
    );
}

export function openFileListDialog(file) {
    setGdata(file)
}

export default FileListDialog;