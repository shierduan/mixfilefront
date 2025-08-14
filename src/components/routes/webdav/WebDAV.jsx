import styled from "styled-components";
import FileWindow from "./components/filewindow/FileWindow.jsx";
import NavBar from "./components/filewindow/NavBar.jsx";
import ActionBar from "./components/actionbar/ActionBar.jsx";
import {addDialog} from "../../../utils/DialogContainer.jsx";
import DragUpload from "./components/dragupload/DragUpload.jsx";
import {useSnapshot} from "valtio";
import {webDavState} from "./state/WebDavState.js";

const Container = styled.div`
    margin: 50px auto 10px auto;
    display: flex;
    justify-content: center;
    width: 100%;
    max-width: 1200px;
    padding: 10px;
    min-height: 60vh;
    flex-direction: column;
    gap: 10px;
    align-items: center;
`


function WebDav(props) {

    document.title = 'WebDAV | MixFile'

    useSnapshot(webDavState)

    return (
        <Container onDragEnter={(event) => {
            if (webDavState.singleFile !== false) {
                return;
            }
            const items = event.dataTransfer.items;
            if (!items || ![...items].some(item => item.kind === 'file')) {
                return
            }
            addDialog(<DragUpload/>)
        }}>
            <NavBar/>
            <FileWindow/>
            <ActionBar/>
        </Container>
    );
}

export default WebDav;