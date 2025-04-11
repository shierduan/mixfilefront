import styled from "styled-components";
import {useState} from "react";
import {Button, TextField} from "@mui/material";
import {decodeMixFileName, decodeMixShareCode} from "../../utils/ShareCode.js";
import {openFileListDialog} from "./FileList.jsx";
import {notifyMsg} from "../../utils/CommonUtils.js";
import {addDialog} from "../../utils/DialogContainer.jsx";
import FileDialog from "./FileDialog.jsx";

const Container = styled.div`
    display: flex;
    gap: 10px;
    width: 1000px;
    max-width: 95vw;
    justify-content: center;
    padding: 10px;
    font-size: max(.6rem, 16px);

    .MuiTextField-root {
        width: 70%;
    }

    input {
        font-size: max(.6rem, 16px)
    }

    label {
        font-size: max(.6rem, 16px)
    }

    button {
        max-width: 100px;
        width: 30%;
        font-size: max(.8rem, 18px)
    }

`

export function resolveMixFile(input) {
    let code = input.trim()
    code = decodeMixShareCode(code)
    let {fileName, fileSize} = decodeMixFileName(code)
    if (!fileName) {
        return notifyMsg('解密分享码失败', {toastId: 'decode-share-code'})
    }
    if (fileName.endsWith(".mix_list")) {
        return openFileListDialog(code)
    }
    addDialog(<FileDialog data={{
        name: fileName,
        size: fileSize,
        shareInfoData: code
    }}/>)
}

function FileResolve(props) {

    const [input, setInput] = useState('')

    return (
        <Container>
            <TextField label={'输入分享码'} variant={'outlined'} value={input} onChange={(event) => {
                setInput(event.target.value)
            }}/>
            <Button variant={'contained'} onClick={async () => {
                let code = input.trim()
                resolveMixFile(code)
            }}>解析</Button>
        </Container>
    );
}

export default FileResolve;
