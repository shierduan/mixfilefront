import styled from "styled-components";
import useApi from "../../../../../hooks/useApi.jsx";
import {parsePropfindXML} from "../../utils/WebDavUtils.jsx";
import WebDavFileCard from "./WebDavFileCard.jsx";
import {deepEqual, noProxy, run} from "../../../../../utils/CommonUtils.jsx";
import {useLocation} from "react-router-dom";
import FileSort from "./FileSort.jsx";
import VirtualList from "../../../../common/base/VirtualList.jsx";
import {useSnapshot} from "valtio";
import {Checkbox} from "@mui/material";
import useDeepCompareEffect from "../../../../../hooks/useDeepCompareEffect.js";
import {boxesIntersect, useSelectionContainer} from "@air/react-drag-to-select";
import {createPortal} from "react";
import SingleFilePage from "./single_file/SingleFilePage.jsx";
import {webDavState} from "../../state/WebDavState.js";
import {dialogList} from "../../../../../utils/DialogContainer.jsx";
import VideoPreview from "../video/VideoPreview.jsx";


const Container = styled.div`
    display: flex;
    width: 100%;
    border-radius: 10px;
    flex-direction: column;
    padding: 0px 10px;
    gap: 5px;

    > .content {
        flex-direction: column;
        display: flex;
        min-height: 50vh;
    }

    .empty {
        margin-top: 50px;
        width: 100%;
        text-align: center;
        color: gray;
    }


`


function FileWindow(props) {

    const path = useLocation().pathname;

    useSnapshot(webDavState)


    const {sort, files, sortedFiles, singleFile, selectedFiles} = webDavState


    useDeepCompareEffect(() => {
        if (singleFile) {
            selectedFiles.length = 0
            selectedFiles.push(singleFile)
            return
        }
        const fileLocations = files.map((it) => it.href)
        //remove deleted files from selectedFiles
        const filtered = selectedFiles.filter((it) => fileLocations.includes(it.href))
        selectedFiles.length = 0
        selectedFiles.push(...filtered)
    }, [files, singleFile])


    const {DragSelection} = useSelectionContainer({
        eventsElement: document.body,
        shouldStartSelecting() {
            return !webDavState.singleFile && dialogList.length === 0
        },
        onSelectionChange: (box) => {

            const fileLocationMap = files.reduce((acc, item, index) => {
                acc[item.href] = item;
                return acc;
            }, {});

            const filesToSelect = document.querySelectorAll('.dav-file-card')
                .values()
                .toArray()
                .filter((it) => {
                    return boxesIntersect(box, it.getBoundingClientRect())
                })
                .map((it) => {
                    return fileLocationMap[it.dataset.davFileHref]
                })

            selectedFiles.length = 0
            selectedFiles.push(...filesToSelect)
        },
        selectionProps: {
            className: 'dav-selection-box',
        },
    });

    useDeepCompareEffect(() => {
        webDavState.sortedFiles = files.slice().sort(sort.func)
    }, [sort, files])


    const {content} = useApi({
        path: `api${path}`,
        method: 'PROPFIND',
        headers: {
            depth: 1
        },
        callback(data) {
            const files = parsePropfindXML(data)
            if (files.length === 0) {
                return;
            }

            document.title = `${files[0].name} | MixFile`;
            // 具体文件页面
            if (files.length === 1 && !files[0].isFolder) {
                webDavState.files = []
                webDavState.singleFile = files[0]
                return
            }

            webDavState.singleFile = false

            //去掉目录文件
            files.shift()

            //去掉存档文件
            files.pop()

            //对比文件是否更新
            if (deepEqual(webDavState.files, files)) {
                return;
            }

            webDavState.files = files;
        },
        refreshInterval: 1000,
        content() {
            if (singleFile) {
                return <SingleFilePage file={singleFile}/>
            }

            if (sortedFiles.length === 0) {
                return <h4 className={'empty'}>文件夹为空</h4>
            }

            return (
                <VirtualList rowCount={sortedFiles.length}
                             rowHeight={45}
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

                                 const file = sortedFiles[index]

                                 return <div key={key} style={style} className={'dav-file-card'}
                                             data-dav-file-href={file.href}>
                                     <WebDavFileCard file={file}/>
                                 </div>
                             }}/>
            )
        }
    })


    const header = run(() => {
        if (singleFile !== false) {
            return null
        }
        return (
            <FileSort
                setSort={(sort) => {
                    webDavState.sort = noProxy(sort)
                }}
                sort={sort}
            >
                <Checkbox
                    checked={selectedFiles.length === files.length && files.length > 0}
                    onChange={(event, checked) => {
                        selectedFiles.length = 0
                        if (checked) {
                            selectedFiles.push(...files)
                        }
                    }}/>
            </FileSort>
        )
    })


    const videoPreview = run(() => {
        if (singleFile?.mimeType?.startsWith('video/')) {
            return (
                <VideoPreview file={singleFile}/>
            )
        }
        return null
    })

    return (
        <Container className={"shadow"}>
            {
                createPortal(<DragSelection/>, document.body)
            }

            {header}

            <div class="content dav-file-window-content">
                {videoPreview}
                {content}
            </div>
        </Container>
    );
}

export default FileWindow;