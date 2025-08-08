import styled from "styled-components";
import useApi from "../../../../../hooks/useApi.jsx";
import {parsePropfindXML} from "../../utils/WebDavUtils.js";
import WebDavFileCard from "./WebDavFileCard.js";
import {compareByName, paramProxy} from "../../../../../utils/CommonUtils.js";
import {useSnapshot} from "valtio";
import {useEffect} from "react";

const Container = styled.div`
    display: flex;
    width: 100%;
    max-width: 1200px;
    min-height: 50vh;
    border-radius: 10px;
    flex-direction: column;
    padding: 5px;
    gap: 5px;
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
            return files.map((file) => <WebDavFileCard file={file} key={file.name}/>)
        }
    })

    return (
        <Container className={"shadow"}>
            {content}
        </Container>
    );
}

export default FileWindow;