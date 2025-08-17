import styled from "styled-components";
import useApi from "../../../../../../../hooks/useApi.jsx";

const Container = styled.div`
    width: 100%;
    height: 100%;
    max-height: 50vh;
    overflow-y: auto;

    .code {
        padding: 10px;
        border-radius: 10px;
        background-color: rgba(205, 168, 244, 0.16);
        white-space: pre-wrap;
    }
`

function TextPreview({file}) {

    const {name, url} = file


    const {content} = useApi({
        path: url,
        content(code) {
            return (
                <pre className={'code'}>
                  <code>{code}</code>
                </pre>
            )
        }
    })

    return (
        <Container>
            {content}
        </Container>
    );
}


export default TextPreview;