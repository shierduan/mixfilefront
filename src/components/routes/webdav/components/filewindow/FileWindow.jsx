import styled from "styled-components";
import useApi from "../../../../../hooks/useApi.jsx";
import {parsePropfindXML} from "../../utils/WebDavUtils.js";
import WebDavFileCard from "./WebDavFileCard.jsx";
import {compareByName, paramProxy} from "../../../../../utils/CommonUtils.js";
import {useSnapshot} from "valtio";
import {useEffect} from "react";
import {AutoSizer, List} from "react-virtualized";

const Container = styled.div`
    display: flex;
    width: 100%;
    max-width: 1200px;
    min-height: 50vh;
    border-radius: 10px;
    flex-direction: column;
    padding: 5px;
    gap: 5px;

    .empty {
        margin-top: 50px;
        width: 100%;
        text-align: center;
        color: gray;
    }
`

export const webDavState = paramProxy({
    path: ''
})

function FileWindow(props) {

    const {path} = useSnapshot(webDavState)

    useEffect(() => {
        return () => {
            webDavState.path = ''
        }
    }, [])

    const content = useApi({
        path: `api/webdav${path}`,
        method: 'PROPFIND',
        headers: {
            depth: 1
        },
        content(data) {
            const files = parsePropfindXML(data).slice(1).filter((it) => it.name !== "当前目录存档.mix_dav").sort((a, b) => {
                if (a.isFolder !== b.isFolder) {
                    return a.isFolder ? -1 : 1;
                }
                return compareByName(a.name, b.name)
            })
            if (files.length === 0) {
                return <h4 className={'empty'}>文件夹为空</h4>
            }

            // return files.map((file) => <WebDavFileCard file={file} key={file.name}/>)

            const renderer = ({
                                  index, // Index of row
                                  isScrolling, // The List is currently being scrolled
                                  isVisible, // This row is visible within the List (eg it is not an overscanned row)
                                  key, // Unique key within array of rendered rows
                                  parent, // Reference to the parent List (instance)
                                  style, // Style object to be applied to row (to position it);
                                  // This must be passed through to the rendered row element.
                              }) => {
                const file = files[index]

                return <div key={key} style={style}>
                    <WebDavFileCard file={file}/>
                </div>
            }

            return <AutoSizer>
                {({width, height}) => (
                    <List
                        width={width}
                        height={height}
                        rowCount={files.length}
                        rowHeight={40}
                        rowRenderer={renderer}/>
                )}
            </AutoSizer>
        }
    })

    return (
        <Container className={"shadow"}>
            {content}
        </Container>
    );
}

export default FileWindow;