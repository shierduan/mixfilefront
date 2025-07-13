import styled from "styled-components";
import {useEffect, useState} from "react";
import {client} from "../../config.js";
import {formatFileSize} from "../../utils/CommonUtils.js";
import {addDialog} from "../../utils/DialogContainer.jsx";
import {Button} from "@mui/material";
import FileExportDialog from "./FileExport.jsx";
import {resolveMixFile} from "./FileResolve.jsx";

const Container = styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px;
    width: 100%;

    button {
        font-size: max(.6rem, 14px);
    }

`

const CardContainer = styled.div`
    transition: .3s;
    background-color: rgba(210, 172, 254, 0.25);
    display: flex;
    gap: 10px;
    padding: 10px;
    flex-wrap: wrap;
    word-break: break-all;
    border-radius: 5px;
    cursor: pointer;
    color: #8e2afe;
    border: 1px solid rgba(142, 42, 254, 0.53);;
    box-shadow: rgba(75, 82, 86, 0.66) 0px 2px 10px 0px;

    &:hover {
        background-color: rgba(210, 172, 254, 0.5);
    }
`

export function FileCard({item}) {
    const {name, size, time, shareInfoData} = item
    return (
        (<CardContainer className={'animate__animated animate__bounceIn'} onClick={() => {
            resolveMixFile(shareInfoData)
        }}>
            <h4 className={'text-hide'}>{name}</h4>
            <p>{formatFileSize(size)}</p>
        </CardContainer>)
    )
}

function FileHistory(props) {

    const [fetchedList, setFetchedList] = useState([]);

    async function updateResult() {
        const result = await client.get('api/upload_history')
        setFetchedList(result.data)
    }

    useEffect(() => {
        updateResult()
        const id = setInterval(updateResult, 2000)
        return () => {
            clearInterval(id)
        }
    }, []);
    let exportButton = null

    if (fetchedList.length > 1) {
        exportButton = <Button variant={'outlined'} className={'animate__animated animate__bounceIn'} onClick={() => {
            addDialog(<FileExportDialog fileList={fetchedList}/>)
        }}>
            导出文件列表
        </Button>
    }

    return (
        <Container>
            {exportButton}

            {
                fetchedList.map((item) => <FileCard item={item} key={item.shareInfoData}/>)
            }

        </Container>
    );
}

export default FileHistory;
