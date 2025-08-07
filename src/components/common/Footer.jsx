import styled from "styled-components";

const Container = styled.div`
    margin: 20px auto;
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

function Footer(props) {
    return (
        <Container>
            <div class="github">
                <a
                    href={'https://github.com/InvertGeek/MixFile'}
                    className={'gradient-text'}
                    target="_blank"
                >
                    Github地址: https://github.com/InvertGeek/MixFile
                </a>
            </div>
        </Container>
    );
}

export default Footer;