import {Box, LinearProgress} from "@mui/material";
import {useEffect} from "react";
import styled from "styled-components";
import useUnmountEffect from "../../../hooks/useUnmountEffect.js";
import {uploadFile} from "../FileUpload.jsx";
import {useSnapshot} from "valtio";

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

export function ProgressCard({file: upFile}) {

    const {tip, progress, cancel, title, error} = useSnapshot(upFile)

    useUnmountEffect(() => {
        cancel?.()
    }, [cancel])

    useEffect(() => {
        uploadFile(upFile)
    }, []);

    return <Container className={'shadow'} error={error}>
        <h4>{title}</h4>
        <LinearProgressWithLabel value={progress}/>
        <p>{tip}</p>
    </Container>
}
