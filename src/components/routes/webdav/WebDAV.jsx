import styled from "styled-components";
import FileWindow from "./components/filewindow/FileWindow.jsx";
import NavBar from "./components/filewindow/NavBar.jsx";
import ActionBar from "./components/actionbar/ActionBar.jsx";
import {addDialog} from "../../../utils/DialogContainer.jsx";
import DragUpload from "./components/dragupload/DragUpload.jsx";

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

    return (
        <Container onDragEnter={() => {
            addDialog(<DragUpload/>)
        }}>
            <NavBar/>
            <FileWindow/>
            <ActionBar/>
        </Container>
    );
}

export default WebDav;