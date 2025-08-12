import {useEffect} from "react";
import {apiAddress} from "../../config.js";
import {Button} from "@mui/material";
import {copyText, formatFileSize} from "../../utils/CommonUtils.js";
import {addDialog} from "../../utils/DialogContainer.jsx";
import {resolveMixFile} from "../routes/home/components/FileResolve.jsx";
import {MixFileChip, MixFileDataContainer} from "./StyleContainers.jsx";
import useApi from "../../hooks/useApi.jsx";
import VirtualList from "../common/VirtualList.jsx";
import {FILE_SORTS} from "../routes/webdav/components/filewindow/FileWindow.jsx";
import useProxyState from "../../hooks/useProxyState.js";

function FileDavDialog({data}) {

    const state = useProxyState({
        davFile: {},
        currentFile: {},
        pathHistory: []
    })


    useEffect(() => {

        history.pushState(null, null, location.href);

        const listener = function (event) {
            const {pathHistory} = state
            history.pushState(null, null, location.href);
            if (pathHistory.length > 0) {
                state.currentFile = pathHistory.pop()
            }
        }

        window.addEventListener('popstate', listener);

        return () => {
            window.removeEventListener('popstate', listener)
        }
    }, [state.pathHistory]);

    useEffect(() => {
        state.currentFile = state.davFile
    }, [state.davFile]);


    let topButton = <></>

    if (state.pathHistory.length > 0) {
        topButton = <Button variant={'outlined'} onClick={() => {
            state.currentFile = state.pathHistory.pop()
        }}>上一级</Button>
    }

    const content = useApi({
        path: `api/download?s=${data}&response-content-encoding=gzip`,
        callback(data) {
            state.davFile = JSON.parse(data.substring(5))
        },
        content() {
            const {currentFile, pathHistory} = state

            const fileList = Object.values(currentFile.files ?? {}).sort(FILE_SORTS.name.func);

            return <>
                <h3 className={'no-select'}>{[...pathHistory, currentFile].map((it) => it.name).join("/")} 共{fileList.length}个文件</h3>
                {topButton}
                <div class="content">
                    <VirtualList
                        rowCount={fileList.length}
                        rowHeight={100}
                        rowRenderer={(ctx) => {
                            const {
                                index, // Index of row
                                isScrolling, // The List is currently being scrolled
                                isVisible, // This row is visible within the List (eg it is not an overscanned row)
                                key, // Unique key within array of rendered rows
                                parent, // Reference to the parent List (instance)
                                style, // Style object to be applied to row (to position it);
                                // This must be passed through to the rendered row element.
                            } = ctx
                            const file = fileList[index];


                            const {name, size, time, shareInfoData, isFolder} = file

                            let description = <p>{formatFileSize(size)}</p>
                            if (isFolder) {
                                description = <p>文件夹</p>
                            }

                            return (
                                <MixFileChip key={key} style={style} onClick={() => {
                                    if (isFolder) {
                                        state.pathHistory = [...pathHistory, currentFile]
                                        state.currentFile = file ?? {}
                                        return
                                    }
                                    resolveMixFile(shareInfoData)
                                }}>
                                    <div class="content shadow">
                                        <h4 className={'text-hide'}>{name}</h4>
                                        {description}
                                    </div>
                                </MixFileChip>
                            );
                        }
                        }
                    />
                </div>
            </>
        }
    })


    return (
        <MixFileDataContainer className={'shadow'}>
            {content}
            <Button variant={'outlined'} onClick={() => {
                copyText(`mf://${data}`)
            }}>复制分享码</Button>
            <Button variant={'contained'} onClick={() => {
                window.open(`${apiAddress}api/download?s=${encodeURIComponent(data)}`)
            }}>下载存档文件</Button>
        </MixFileDataContainer>
    );
}

export function openFileDavDialog(file) {
    addDialog(<FileDavDialog data={file}/>)
}

export default FileDavDialog;