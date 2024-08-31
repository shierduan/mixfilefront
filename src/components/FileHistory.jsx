import styled from "styled-components";
import {useEffect, useState} from "react";
import {client} from "../config.js";
import {formatFileSize} from "../utils/CommonUtils.js";
import {openFileDialog} from "./FileDialog.jsx";

const Container = styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px;
    width: 100%;

    .file-card {
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
    }


`

function FileCard({item}) {
    const {name, size, time, shareInfoData} = item
    return (
        (<div className={'file-card animate__animated animate__bounceIn'} onClick={() => {
            openFileDialog(item)
        }}>
            <h4>{name}</h4>
            <p>{formatFileSize(size)}</p>
        </div>)
    )
}

function FileHistory(props) {

    const [fetchedList, setFetchedList] = useState([]);

    async function updateResult() {
        const result = await client.get('api/upload_history')
        setFetchedList(result.data.reverse())
    }

    useEffect(() => {
        updateResult()
        const id = setInterval(updateResult, 2000)
        return () => {
            clearInterval(id)
        }
    }, []);

    return (
        <Container>

            {
                fetchedList.map((item) => <FileCard item={item} key={item.shareInfoData}/>)
            }

        </Container>
    );
}

export default FileHistory;
