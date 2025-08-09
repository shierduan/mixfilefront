import styled from "styled-components";
import {Button, TextField} from "@mui/material";
import {client} from "../../../../../config.js";
import {openFileListDialog} from "../../../../mixformats/FileList.jsx";
import {useState} from "react";
import {getFormattedDate} from "../../../../../utils/CommonUtils.js";
import {useLocation} from "react-router-dom";

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

function NewFolder(props) {
    const path = useLocation().pathname
    const [loading, setLoading] = useState(false)
    const [folderName, setFolderName] = useState(`文件分享-${getFormattedDate()}`)

    return (
        <Container className={'shadow'}>
            <h4>新建文件夹</h4>
            <div class="content">
                <TextField label={'文件夹名称'} variant={'outlined'} value={folderName} onChange={(event) => {
                    setFolderName(event.target.value.trim())
                }}/>
            </div>
            <Button variant={'contained'} disabled={loading} onClick={async () => {
                setLoading(true)
                try {
                    let response = await client({})
                    openFileListDialog(response.data)
                } finally {
                    setLoading(false)
                }
            }}>新建文件夹</Button>
        </Container>
    );
}

export default NewFolder;