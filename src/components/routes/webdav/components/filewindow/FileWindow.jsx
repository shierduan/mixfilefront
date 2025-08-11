import styled from "styled-components";
import useApi from "../../../../../hooks/useApi.jsx";
import {parsePropfindXML} from "../../utils/WebDavUtils.js";
import WebDavFileCard from "./WebDavFileCard.jsx";
import {compareByName} from "../../../../../utils/CommonUtils.js";
import {useLocation} from "react-router-dom";
import FileSort from "./FileSort.jsx";
import {useState} from "react";
import VirtualList from "../../../../common/VirtualList.jsx";

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


function FileWindow(props) {

    const path = useLocation().pathname;

    const [sort, setSort] = useState(FILE_SORTS.name);

    const content = useApi({
        path: `api${path}`,
        method: 'PROPFIND',
        headers: {
            depth: 1
        },
        refreshInterval: 1000,
        content(data) {
            const files = parsePropfindXML(data)

            //去掉目录文件
            files.shift()

            //去掉存档文件
            files.pop()

            files.sort(sort.func)

            if (files.length === 0) {
                return <h4 className={'empty'}>文件夹为空</h4>
            }

            return (
                <VirtualList rowCount={files.length}
                             rowHeight={40}
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

                                 return <div key={key} style={style}>
                                     <WebDavFileCard file={file}/>
                                 </div>
                             }}/>
            )
        }
    })

    return (
        <Container className={"shadow"}>
            <FileSort setSort={setSort} sort={sort}/>
            <div class="content">
                {content}
            </div>
        </Container>
    );
}

export default FileWindow;