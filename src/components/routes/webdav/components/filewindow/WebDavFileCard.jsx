import styled from "styled-components";
import {formatFileSize, getFormattedDate, notifyMsg} from "../../../../../utils/CommonUtils.js";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile.js";
import FolderCopyIcon from '@mui/icons-material/FolderCopy';
import VideoFileIcon from '@mui/icons-material/VideoFile';
import ImageIcon from '@mui/icons-material/Image';
import {useLocation, useNavigate} from "react-router-dom";
import RightClickMenu from "../../../../common/RightClickMenu.jsx";
import {showConfirmWindow} from "../../../../common/ConfirmWindow.jsx";
import {addDialog, dialogProxy} from "../../../../../utils/DialogContainer.jsx";
import {deleteFile} from "../../utils/WebDavUtils.js";
import RenameFile from "../dialog/RenameFile.jsx";

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

    svg {
        filter: drop-shadow(0px 1px 6px rgba(0, 0, 0, 0.2));
    }

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
        url,
        shareInfo,
        lastModified,
    } = file

    let fileSize = null
    if (!isFolder) {
        fileSize = <div>{formatFileSize(size)}</div>
    }

    const navigate = useNavigate();
    const path = useLocation().pathname

    const menuItems = [
        {
            label: "打开",
            onClick() {
                console.log("打开")
            }
        },
        {
            label: "重命名",
            onClick() {
                addDialog(<RenameFile path={path} name={name}/>)
            }
        },
        {
            label: "删除",
            onClick: () => {
                showConfirmWindow('确认删除文件?', async () => {
                    await deleteFile(url)
                    notifyMsg('文件已删除')
                    dialogProxy.pop()
                })
            }
        },
    ];

    return (
        <RightClickMenu items={menuItems}>
            <Container onClick={() => {
                if (isFolder) {
                    navigate(path + `/${name}`)
                    return
                }
                window.open(url)
            }}>
                <div class="file-name animate__animated animate__fadeIn animate__faster">
                    <div class="name">
                        <FileIcon file={file}/>
                        <h4>{name}</h4>
                    </div>
                    {fileSize}
                </div>
                <div className={'file-date'}>{getFormattedDate(lastModified)}</div>
            </Container>
        </RightClickMenu>
    );
}

export default WebDavFileCard;