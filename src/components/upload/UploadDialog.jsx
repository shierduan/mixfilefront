import {useState} from 'react';
import styled from "styled-components";
import {Backdrop, Button} from "@mui/material";
import {ProgressCard} from "./FileCard.jsx";

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
        gap: 10px;
        display: flex;
        flex-direction: column;
        max-height: 60vh;
        overflow-y: auto;
    }

    p {
        white-space: nowrap;
        font-weight: bold;
    }

    button {
        font-size: max(.6rem, 14px);
    }
`

let setFileList = null


function UploadDialog(props) {

    const [fileList, setList] = useState([])
    setFileList = setList


    if (fileList.length === 0) {
        return null
    }

    return (
        <Backdrop open>
            <Container className={'shadow'}>
                <h3>{fileList.length} 个文件正在上传</h3>
                <div class="content">
                    {
                        fileList.map((file, index) =>
                            <ProgressCard file={file} key={index}/>
                        )
                    }
                </div>
                <Button variant={'contained'} onClick={() => {
                    setFileList([])
                }}>取消</Button>
            </Container>
        </Backdrop>
    );
}

export function addFileList(list) {
    setFileList((prev) => [...prev, ...list])
}

export default UploadDialog;
