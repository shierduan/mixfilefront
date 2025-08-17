import styled from "styled-components";
import {useState} from "react";
import {Button, TextField} from "@mui/material";
import {decodeMixFile} from "../../utils/ShareCode.js";
import {openFileListDialog} from "../mixformats/FileList.jsx";
import {addDialog} from "../../utils/DialogContainer.jsx";
import FileDialog from "../routes/home/components/dialog/FileDialog.jsx";
import {notifyError, run} from "../../utils/CommonUtils.jsx";
import {openFileDavDialog} from "../mixformats/DavList.jsx";

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

    button {
        max-width: 100px;
        width: 30%;
        font-size: max(.8rem, 18px)
    }

`

export function resolveMixFile(code, file) {
    let {fileName, fileSize} = file ?? decodeMixFile(code)
    if (!fileName) {
        return notifyError('解密分享码失败');
    }
    if (fileName.endsWith(".mix_list")) {
        return openFileListDialog(code)
    }
    if (fileName.endsWith(".mix_dav")) {
        return openFileDavDialog(code)
    }
    addDialog(<FileDialog data={{
        name: fileName,
        size: fileSize,
        shareInfoData: code
    }}/>)
}

function FileResolve({callback = resolveMixFile}) {

    const [input, setInput] = useState('')

    return (
        <Container>
            <TextField label={'输入分享码'} variant={'outlined'} value={input} onChange={(event) => {
                setInput(event.target.value)
            }}/>
            <Button variant={'contained'} onClick={async () => {
                let code = input.trim()
                run(async () => {
                    let file = decodeMixFile(code)
                    if (!file?.fileName) {
                        return notifyError('解密分享码失败');
                    }
                    callback?.(code, file)
                })
            }} disabled={!input.trim().length}>解析</Button>
        </Container>
    );
}

export default FileResolve;
