import styled from "styled-components";

const Container = styled.div`
    display: flex;
    justify-content: center;
    padding: 20px;
    width: 100%;
    font-weight: bold;
    font-size: min(10vw, 50px);
    color: #a632f9;
`

function NotFound(props) {
    return (
        <Container>404 - 页面不存在</Container>
    );
}

export default NotFound;