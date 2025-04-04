import styled from "styled-components";
import {useEffect, useState} from "react";
import {apiAddress} from "../../config.js";
import {Button, CircularProgress} from "@mui/material";
import axios from "axios";
import pako from "pako";
import {formatFileSize, notifyMsg} from "../../utils/CommonUtils.js";
import {CopyToClipboard} from "react-copy-to-clipboard/src";
import {addDialog} from "../../utils/DialogContainer.jsx";
import {List} from "react-virtualized";
import FileDialog from "./FileDialog.jsx";

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
    overflow: hidden;

    > .content {
        gap: 10px;
        display: flex;
        flex-direction: column;
        max-height: 60vh;
        min-height: 100px;
        overflow-y: auto;
        justify-content: center;
        align-items: center;
    }

    button {
        max-width: 100%;
        font-size: max(.6rem, 14px);
    }
`

const FileContainer = styled.div`
    cursor: pointer;
    padding: 5px;
    width: 100%;
    height: 100%;
    max-width: 90vw;

    > .content {
        display: flex;
        flex-direction: column;
        gap: 10px;
        background-color: rgba(229, 207, 254, 0.25);
        border-radius: 5px;
        transition: .3s;
        padding: 5px;
        width: 100%;
        height: 100%;
        border: 1px solid rgba(142, 42, 254, 0.53);;

        &:hover {
            background-color: rgba(210, 172, 254, 0.5);
        }
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

    function rowRenderer({
                             index, // Index of row
                             isScrolling, // The List is currently being scrolled
                             isVisible, // This row is visible within the List (eg it is not an overscanned row)
                             key, // Unique key within array of rendered rows
                             parent, // Reference to the parent List (instance)
                             style, // Style object to be applied to row (to position it);
                             // This must be passed through to the rendered row element.
                         }) {
        const file = fileList[index];


        const {name, size, time, shareInfoData} = file
        return (
            <FileContainer key={key} style={style} onClick={() => {
                if (name.endsWith('.mix_list')) {
                    openFileListDialog(shareInfoData)
                    return
                }
                addDialog(<FileDialog data={file}/>)
            }}>
                <div class="content shadow">
                    <h4 className={'text-hide'}>{name}</h4>
                    <p>{formatFileSize(size)}</p>
                </div>
            </FileContainer>
        );
    }

    let content = <CircularProgress/>
    if (fileList.length > 0) {
        content = <List
            width={480}
            height={600}
            rowCount={fileList.length}
            rowHeight={100}
            rowRenderer={rowRenderer}
        />
    }

    return (
        <Container className={'shadow'}>
            <h3>共{fileList.length}个文件</h3>
            <div class="content">
                {content}
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