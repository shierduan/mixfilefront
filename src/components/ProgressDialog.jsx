import {useState} from 'react';
import styled from "styled-components";
import {Backdrop, Box, Button, LinearProgress} from "@mui/material";

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

    p {
        white-space: nowrap;
        font-weight: bold;
    }

    button {
        font-size: max(.6rem, 14px);
    }
`

let setGdata = null


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


function ProgressDialog(props) {
    const [data, setData] = useState({
        open: false,
        tip: '',
        progress: 0,
        cancel: null,
        title: ''
    })
    setGdata = setData
    const {open, tip, progress, cancel, title} = data ?? {}

    if (!open) {
        return null
    }

    return (
        <Backdrop open>
            <Container className={'shadow'}>
                <h4>{title}</h4>
                <LinearProgressWithLabel value={progress}/>
                <p>{tip}</p>
                {cancel && <Button variant={'contained'} onClick={() => {
                    cancel?.()
                    setProgressState({open: false})
                }}>取消</Button>}
            </Container>
        </Backdrop>
    );
}

export function setProgressState(state) {
    setGdata(state)
}

export default ProgressDialog;
