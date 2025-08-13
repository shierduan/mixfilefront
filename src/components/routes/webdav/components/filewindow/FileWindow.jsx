import styled from "styled-components";
import useApi from "../../../../../hooks/useApi.jsx";
import {parsePropfindXML} from "../../utils/WebDavUtils.jsx";
import WebDavFileCard from "./WebDavFileCard.jsx";
import {compareByName, noProxy} from "../../../../../utils/CommonUtils.jsx";
import {useLocation} from "react-router-dom";
import FileSort from "./FileSort.jsx";
import VirtualList from "../../../../common/VirtualList.jsx";
import {proxy, ref, useSnapshot} from "valtio";
import {Checkbox} from "@mui/material";
import useProxyState from "../../../../../hooks/useProxyState.js";
import useDeepCompareEffect from "../../../../../hooks/useDeepCompareEffect.js";
import {boxesIntersect, useSelectionContainer} from "@air/react-drag-to-select";
import {createPortal} from "react";


const Container = styled.div`
    display: flex;
    width: 100%;
    border-radius: 10px;
    flex-direction: column;
    padding: 0px 10px;
    gap: 5px;

    .content {
        flex-direction: column;
        display: flex;
        min-height: 60vh;
    }

    .empty {
        margin-top: 50px;
        width: 100%;
        text-align: center;
        color: gray;
    }


`
const isFolderFirst = (a, b) => a.isFolder === b.isFolder ? 0 : a.isFolder ? -1 : 1;

export const FILE_SORTS = {
    name: {
        func: (a, b) => isFolderFirst(a, b) || compareByName(a.name, b.name)
    },
    size: {
        func: (a, b) => isFolderFirst(a, b) || a.size - b.size
    },
    date: {
        func: (a, b) => isFolderFirst(a, b) || a.lastModified - b.lastModified
    }
}

export const selectedFiles = proxy([])


function FileWindow(props) {

    const path = useLocation().pathname;

    useSnapshot(selectedFiles)

    const state = useProxyState({
        sort: noProxy(FILE_SORTS.name),
        files: [],
    })

    const {sort, files} = state
    const filesEffectDep = files.map(
        ({
             size,
             href,
             isFolder,
         }) => {
            return {
                size,
                isFolder,
                href
            }
        })

    useDeepCompareEffect(() => {
        const fileLocations = files.map((it) => it.href)
        //remove deleted files from selectedFiles
        const filtered = selectedFiles.filter((it) => fileLocations.includes(it.href))
        selectedFiles.length = 0
        selectedFiles.push(...filtered)

    }, [filesEffectDep])

    const {DragSelection} = useSelectionContainer({
        eventsElement: document.documentElement,
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

    const content = useApi({
        path: `api${path}`,
        method: 'PROPFIND',
        headers: {
            depth: 1
        },
        callback(data) {
            const files = parsePropfindXML(data)

            //去掉目录文件
            files.shift()

            //去掉存档文件
            files.pop()
            state.files = ref(files);
        },
        refreshInterval: 1000,
        content() {
            files.sort(sort.func)

            if (files.length === 0) {
                return <h4 className={'empty'}>文件夹为空</h4>
            }

            return (
                <VirtualList rowCount={files.length}
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

                                 const file = files[index]

                                 return <div key={key} style={style} className={'dav-file-card'}
                                             data-dav-file-href={file.href}>
                                     <WebDavFileCard file={file}/>
                                 </div>
                             }}/>
            )
        }
    })

    return (
        <Container className={"shadow"}>
            {
                createPortal(<DragSelection/>, document.body)
            }
            <FileSort
                setSort={(sort) => {
                    state.sort = noProxy(sort)
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
            <div class="content dav-file-window-content">
                {content}
            </div>
        </Container>
    );
}

export default FileWindow;