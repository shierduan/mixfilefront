import DialogDiv from "../../../../common/DialogDiv.jsx";
import {SimpleTreeView, TreeItem} from "@mui/x-tree-view";
import styled from "styled-components";
import useApi from "../../../../../hooks/useApi.jsx";
import {parsePropfindXML} from "../../utils/WebDavUtils.js";
import {Button, CircularProgress} from "@mui/material";
import {useState} from "react";
import {addDialog, dialogProxy} from "../../../../../utils/DialogContainer.jsx";
import {FILE_SORTS} from "../filewindow/FileWindow.jsx";

const Container = styled(DialogDiv)`
    .MuiTreeItem-label {
        font-size: 16px;
        user-select: none;
    }

    .info {
        width: 100%;
        padding: 10px 5px;
        display: flex;
        justify-content: center;
    }

    .empty {
        color: gray;
    }

    .tip {
        color: rgba(120, 86, 158, 0.86);
        font-weight: bold;
        padding: 0px 10px;
    }

    .actions {
        padding: 10px;
        display: flex;
        gap: 20px;
        flex-wrap: wrap;
    }

`


function FolderTreeItem({path}) {
    return useApi({
        path: `api/webdav${path}`,
        method: 'PROPFIND',
        headers: {
            depth: 1
        },
        loading: <div class={'info'}><CircularProgress size={20}/></div>,
        content(data) {
            const files = parsePropfindXML(data)

            //去掉目录文件
            files.shift()

            files.sort(FILE_SORTS.name.func)

            const folders = files.filter((it) => it.isFolder)
            if (folders.length === 0) {
                return <div class={'empty info no-select'}>无下级目录</div>
            }

            return (
                folders.map(({name}) => {

                    const folderPath = `${path}/${name}`

                    return (
                        <TreeItem itemId={folderPath} label={name} key={folderPath}>
                            <FolderTreeItem path={folderPath}/>
                        </TreeItem>
                    )
                })
            )
        }
    })
}


function FolderSelect({callback}) {

    const [path, setPath] = useState("");


    return (
        <Container className={'shadow'}>
            <h4 className={'no-select'}>选择目录</h4>
            <div class="content">
                <SimpleTreeView
                    onItemSelectionToggle={(
                        event,
                        itemId,
                        isSelected
                    ) => {
                        setPath(itemId)
                    }}
                    defaultExpandedItems={['']}
                    defaultSelectedItems={['']}
                >
                    <TreeItem itemId={''} label={'ROOT'}>
                        <FolderTreeItem path={''}/>
                    </TreeItem>
                </SimpleTreeView>
            </div>
            <div class="tip no-select">
                已选择: {path || '根目录'}
            </div>
            <div class="actions">
                <Button variant={'contained'} onClick={async () => {
                    dialogProxy.pop()
                    callback?.(path)
                }}>确认</Button>
                <Button variant={'outlined'} onClick={async () => {
                    dialogProxy.pop()
                }}>取消</Button>
            </div>
        </Container>
    );
}

export async function selectFolder() {
    return new Promise(resolve => {
        addDialog(<FolderSelect callback={resolve}/>)
    })
}

export default FolderSelect;