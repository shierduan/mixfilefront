import {useState} from 'react';
import styled from "styled-components";
import {Button, TextField} from "@mui/material";
import {getFormattedDate} from "../../utils/CommonUtils.js";
import {apiAddress} from "../../config.js";
import {openFileListDialog} from "./FileList.jsx";
import axios from "axios";
import pako from "pako";

const Container = styled.div`
    display: flex;
    background-color: white;
    padding: 10px;
    border-radius: 10px;
    justify-content: center;
    width: 500px;
    max-width: 95vw;
    gap: 10px;
    flex-direction: column;
    color: #8e2afe;
    word-break: break-all;

    > .content {
        padding: 20px;
        gap: 10px;
        display: flex;
        flex-direction: column;
        max-height: 60vh;
        overflow-y: auto;

        input {
            font-size: max(.6rem, 16px)
        }

        label {
            font-size: max(.6rem, 16px)
        }
    }

    p {
        white-space: nowrap;
        font-weight: bold;
    }

    button {
        font-size: max(.6rem, 14px);
    }
`


function FileExportDialog({fileList}) {


    const [uploading, setUploading] = useState(false)
    const [listName, setListName] = useState(`文件分享-${getFormattedDate()}`)

    return (
        <Container className={'shadow'}>
            <h4>导出文件列表</h4>
            <div class="content">
                <TextField label={'文件列表名称'} variant={'outlined'} value={listName} onChange={(event) => {
                    setListName(event.target.value.trim())
                }}/>
            </div>
            <Button variant={'contained'} disabled={uploading} onClick={async () => {
                const dataList = fileList.map(({name, size, shareInfoData}) => {
                    return {
                        name,
                        size,
                        category: '',
                        time: new Date().getTime(),
                        shareInfoData
                    }
                })
                const shareData = pako.gzip(JSON.stringify(dataList))
                const uploadAddress = `${apiAddress}api/upload?name=${encodeURIComponent(`${listName}.mix_list`)}&add=false`
                setUploading(true)
                try {
                    let response = await axios.put(uploadAddress, shareData, {})
                    openFileListDialog(response.data)
                } finally {
                    setUploading(false)
                }
            }}>确认导出</Button>
        </Container>

    );
}

export default FileExportDialog;
