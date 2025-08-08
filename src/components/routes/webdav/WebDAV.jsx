import styled from "styled-components";
import FileWindow from "./components/filewindow/FileWindow.jsx";
import NavBar from "./components/filewindow/NavBar.jsx";

const Container = styled.div`
    margin: 10px auto;
    display: flex;
    justify-content: center;
    width: 1400px;
    max-width: 100%;
    padding: 10px;
    min-height: 60vh;
    flex-direction: column;
    gap: 10px;
    align-items: center;
`


function WebDav(props) {

    return (
        <Container>
            <NavBar/>
            <FileWindow/>
        </Container>
    );
}

export default WebDav;