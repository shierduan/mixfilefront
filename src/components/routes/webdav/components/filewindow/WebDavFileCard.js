import styled from "styled-components";
import {formatFileSize} from "../../../../../utils/CommonUtils.js";

const Container = styled.div`
    display: flex;
    word-break: break-word;
`

function WebDavFileCard({file}) {

    const {name, isFolder, size, shareInfo} = file

    return (
        <Container>
            <h4>{name}</h4>
            <h4>大小: {formatFileSize(size)}</h4>
        </Container>
    );
}

export default WebDavFileCard;