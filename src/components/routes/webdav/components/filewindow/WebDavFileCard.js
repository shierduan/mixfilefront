import styled from "styled-components";
import {formatFileSize, getFormattedDate} from "../../../../../utils/CommonUtils.js";
import {webDavState} from "./FileWindow.jsx";

const Container = styled.div`
    display: flex;
    padding: 5px;
    border: 1px solid #239aef;
    word-break: break-word;
    gap: 10px;
    flex-wrap: wrap;
    justify-content: space-between;

    cursor: pointer;

    .file-name {
        display: flex;
        flex-wrap: wrap;
        gap: 20px;

        h4 {
            max-width: 50vw;
            width: 400px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
    }

    .file-date {
        @media (max-width: 767px) {
            display: none;
        }
    }

`

function WebDavFileCard({file}) {

    const {
        name,
        isFolder,
        size,
        shareInfo,
        lastModified,
    } = file

    let fileSize = null
    if (!isFolder) {
        fileSize = <div>{formatFileSize(size)}</div>
    }

    return (
        <Container onClick={() => {
            if (isFolder) {
                webDavState.path += `/${name}`
            }
        }}>
            <div class="file-name">
                <h4>{name}</h4>
                {fileSize}
            </div>
            <div className={'file-date'}>{getFormattedDate(lastModified)}</div>
        </Container>
    );
}

export default WebDavFileCard;