import styled from "styled-components";
import {useState} from "react";
import {Button, TextField} from "@mui/material";
import {apiAddress} from "../config.js";
import {decodeMixShareCode} from "../utils/ShareCode.js";

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

function FileResolve(props) {

    const [input, setInput] = useState('')

    return (
        <Container>
            <TextField label={'输入分享码'} variant={'outlined'} value={input} onChange={(event) => {
                setInput(event.target.value)
            }}/>
            <Button variant={'contained'} onClick={() => {
                let code = input.trim()
                code = decodeMixShareCode(code) ?? code
                window.open(`${apiAddress}api/download?s=${encodeURIComponent(code)}`)
            }}>打开</Button>
        </Container>
    );
}

export default FileResolve;
