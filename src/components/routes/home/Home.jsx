import styled from "styled-components";
import FileHistory from "./components/history/FileHistory.jsx";
import FileResolve from "./components/FileResolve.jsx";
import UploadArea from "../../../utils/upload/UploadArea.jsx";
import {addUploadFile} from "../../../utils/upload/FileUpload.js";
import {addDialog} from "../../../utils/DialogContainer.jsx";
import UploadDialog from "../../../utils/upload/UploadDialog.jsx";

const Container = styled.div`
    margin: 5vh auto;
    display: flex;
    justify-content: center;
    //border: 1px solid rgba(160, 158, 158, 0.45);
    width: 1400px;
    max-width: 90vw;
    padding: 10px;
    //box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
    flex-direction: column;
    gap: 20px;
    align-items: center;
`

function Home(props) {

    document.title = '主页 | MixFile'

    return (
        <Container>
            <FileResolve/>
            <UploadArea callback={(files) => {
                addUploadFile(files)
                addDialog(<UploadDialog/>, false)
            }}/>
            <FileHistory/>
        </Container>
    );
}

export default Home;
