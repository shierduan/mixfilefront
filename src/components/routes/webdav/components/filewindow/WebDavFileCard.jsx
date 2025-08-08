import styled from "styled-components";
import {formatFileSize, getFormattedDate} from "../../../../../utils/CommonUtils.js";
import {webDavState} from "./FileWindow.jsx";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile.js";
import FolderCopyIcon from '@mui/icons-material/FolderCopy';
import VideoFileIcon from '@mui/icons-material/VideoFile';
import ImageIcon from '@mui/icons-material/Image';
import {apiAddress} from "../../../../../config.js";

const Container = styled.div`
    display: flex;
    padding: 0px 5px;
    //border: 1px solid #239aef;
    word-break: break-word;
    gap: 10px;
    flex-wrap: wrap;
    justify-content: space-between;
    transition: .3s;
    cursor: pointer;
    border-radius: 10px;
    height: 40px;
    user-select: none;
    color: rgb(64, 38, 83);

    &:hover {
        background-color: rgba(144, 35, 239, 0.11);
    }

    .file-name {
        display: flex;
        gap: 20px;
        align-items: center;
        height: 100%;

        .MuiSvgIcon-root {
            font-size: 30px;
            color: rgba(142, 42, 254, 0.44);
        }

        .name {
            display: flex;
            gap: 5px;
        }

        h4 {
            font-weight: normal;
            max-width: 50vw;
            width: 400px;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
        }
    }

    .file-date {
        @media (max-width: 767px) {
            display: none;
        }
    }

`


function FileIcon({file: {isFolder, mimeType}}) {
    if (isFolder) {
        return <FolderCopyIcon/>
    }
    if (mimeType?.startsWith("video/")) {
        return <VideoFileIcon/>
    }
    if (mimeType?.startsWith("image/")) {
        return <ImageIcon/>
    }

    return <InsertDriveFileIcon/>
}


function WebDavFileCard({file}) {

    const {
        name,
        isFolder,
        size,
        href,
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
                return
            }
            window.open(apiAddress + href)
        }}>
            <div class="file-name">
                <div class="name">
                    <FileIcon file={file}/>
                    <h4>{name}</h4>
                </div>
                {fileSize}
            </div>
            <div className={'file-date'}>{getFormattedDate(lastModified)}</div>
        </Container>
    );
}

export default WebDavFileCard;