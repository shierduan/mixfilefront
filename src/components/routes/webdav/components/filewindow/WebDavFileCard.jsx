import styled from "styled-components";
import {
    formatFileSize,
    getFormattedDate,
    getRoutePath,
    notifyMsg,
    notifyPromise
} from "../../../../../utils/CommonUtils.jsx";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile.js";
import FolderCopyIcon from '@mui/icons-material/FolderCopy';
import VideoFileIcon from '@mui/icons-material/VideoFile';
import ImageIcon from '@mui/icons-material/Image';
import {useNavigate} from "react-router-dom";
import RightClickMenu from "../../../../common/RightClickMenu.jsx";
import {useSnapshot} from "valtio";
import {Checkbox} from "@mui/material";
import {showConfirmWindow} from "../../../../common/ConfirmWindow.jsx";
import {selectFolder} from "../dialog/FolderSelect.jsx";
import {selectedFiles} from "./FileWindow.jsx";

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
            align-items: center;
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


    useSnapshot(selectedFiles)

    function getSelectedIndex() {
        return selectedFiles.findIndex(file => file.name === name)
    }

    function unselect() {
        const selectedIndex = getSelectedIndex()
        if (selectedIndex > -1) {
            selectedFiles.splice(selectedIndex, 1);
        }
    }

    const selectedIndex = getSelectedIndex()

    const checked = selectedIndex > -1

    const navigate = useNavigate();

    const menuItems = [
        {
            label: "复制",
            async onClick() {
                await notifyPromise(file.copyFile(await selectFolder()), '复制文件')
                notifyMsg('操作成功')
            }
        },
        {
            label: "移动",
            async onClick() {
                await notifyPromise(file.moveFile(await selectFolder()), '移动文件')
                notifyMsg('操作成功')
            }
        },
        {
            label: "重命名",
            onClick() {
                file.renameFile()
            }
        },
        {
            label: "删除",
            onClick: () => {
                showConfirmWindow('确认删除文件?', async () => {
                    await notifyPromise(file.deleteFile(), '删除文件')
                    notifyMsg('文件已删除')
                })
            }
        },
    ];

    return (
        <RightClickMenu items={menuItems}>
            <Container onClick={() => {
                if (isFolder) {
                    navigate(getRoutePath() + `/${name}`)
                    return
                }
                window.open(url)
            }}>
                <div class="file-name animate__animated animate__fadeIn animate__faster">
                    <div class="name">
                        <Checkbox
                            checked={checked}
                            onClick={(event) => {
                                event.stopPropagation();
                            }}
                            onChange={(event, selected) => {
                                if (selected) {
                                    selectedFiles.push(file)
                                    return
                                }
                                unselect()
                            }}
                        />
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