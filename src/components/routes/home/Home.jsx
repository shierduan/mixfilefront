import styled from "styled-components";
import FileHistory from "./file/FileHistory.jsx";
import FileResolve from "./file/FileResolve.jsx";
import FileUpload from "./file/FileUpload.jsx";

const Container = styled.div`
    margin: 5vh auto;
    display: flex;
    justify-content: center;
    //border: 1px solid rgba(160, 158, 158, 0.45);
    width: 1400px;
    max-width: 90vw;
    padding: 10px;
    border-radius: 10px;
    //box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
    flex-direction: column;
    gap: 20px;
    align-items: center;
`

function Home(props) {

    return (
        <Container>
            <FileResolve/>
            <FileUpload/>
            <FileHistory/>
        </Container>
    );
}

export default Home;
