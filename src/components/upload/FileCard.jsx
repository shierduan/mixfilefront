import {Box, LinearProgress} from "@mui/material";
import {useEffect, useState} from "react";
import {uploadFile} from "../FileUpload.jsx";
import styled from "styled-components";
import useUnmountEffect from "../../hooks/useUnmountEffect.js";

function LinearProgressWithLabel(props) {
    return (
        <Box sx={{display: 'flex', alignItems: 'center'}}>
            <Box sx={{width: '100%', mr: 1}}>
                <LinearProgress variant="determinate" {...props} />
            </Box>
            <Box sx={{minWidth: 35}}>
                <p>
                    {`${Math.round(props.value)}%`}
                </p>
            </Box>
        </Box>
    );
}

const Container = styled.div`
    display: flex;
    padding: 10px;
    justify-content: center;
    width: 100%;
    gap: 10px;
    flex-direction: column;
    color: ${props => props.error ? 'red' : "#8e2afe"};
    word-break: break-all;
    border: 2px solid ${props => props.error ? 'red' : "rgba(142, 42, 254, 0.6)"};;
    border-radius: 10px;

    p {
        white-space: nowrap;
        font-weight: bold;
    }

    button {
        font-size: max(.6rem, 14px);
    }
`

export function ProgressCard({file}) {

    const [data, setData] = useState({
        error: false,
        tip: '',
        progress: 0,
        title: '',
        cancel: null,
    })

    const {tip, progress, cancel, title, error} = data ?? {}

    useUnmountEffect(() => {
        cancel?.()
    }, [cancel])

    useEffect(() => {
        uploadFile(file, setData)
    }, []);

    return <Container className={'shadow'} error={error}>
        <h4>{title}</h4>
        <LinearProgressWithLabel value={progress}/>
        <p>{tip}</p>
    </Container>
}
