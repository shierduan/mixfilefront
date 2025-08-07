import styled from "styled-components";
import useApi from "../../../../../hooks/useApi.jsx";
import {parsePropfindXML} from "../../utils/WebDavUtils.js";
import WebDavFileCard from "./WebDavFileCard.js";

const Container = styled.div`
    display: flex;
    width: 100%;
    height: 50vh;
    max-width: 1200px;
    border-radius: 10px;
    flex-direction: column;
    padding: 5px;
    gap: 5px;
`

function FileWindow(props) {
    const content = useApi({
        path: 'api/webdav',
        method: 'PROPFIND',
        headers: {
            depth: 1
        },
        content(data) {
            const files = parsePropfindXML(data)
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