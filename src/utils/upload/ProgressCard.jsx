import {Box, LinearProgress} from "@mui/material";
import styled from "styled-components";
import {useSnapshot} from "valtio";
import {resolveMixFile} from "../../components/routes/home/components/FileResolve.jsx";

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
    color: #8e2afe;
    word-break: break-all;
    border: 2px solid rgba(142, 42, 254, 0.6);
    border-radius: 10px;
    transition: .3s;
    background-color: rgba(229, 207, 254, 0.25);

    &.error {
        color: #f64141;
        border: 2px solid #f64141;
    }

    &.done {
        cursor: pointer;

        &:hover {
            background-color: rgba(142, 42, 254, 0.23);
        }
    }

    p {
        overflow: hidden;
        white-space: nowrap;
        font-weight: bold;
        text-overflow: ellipsis;
    }

    button {
        font-size: max(.6rem, 14px);
    }
`

export function ProgressCard({file: upFile}) {

    const {tip, progress, cancel, title, error, result, file, complete} = useSnapshot(upFile)

    const classes = []

    if (error) {
        classes.push('error')
    }
    if (result) {
        classes.push('done')
    }

    return <Container className={`shadow no-select ${classes.join(' ')}`} error={error} onClick={() => {
        if (result) {
            resolveMixFile(result)
        }
    }}>
        <h4 className={'text-hide'}>{title}</h4>
        {!complete && <LinearProgressWithLabel value={progress}/>}
        <p>{tip}</p>
    </Container>
}
