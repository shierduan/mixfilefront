import styled from "styled-components";
import useApi from "../../../../../../../hooks/useApi.jsx";
import * as docx from "docx-preview";

const Container = styled.div`
    #doc-preview-content {
        max-height: 60vh;
        overflow-y: auto;
    }
`

function DocPreview({file}) {

    useApi({
        path: file.url,
        config: {
            responseType: "blob",
        },
        callback: async (data) => {
            await docx.renderAsync(data, document.querySelector('#doc-preview-content'))
        },
    })

    return (
        <Container>
            <div id={'doc-preview-content'}>

            </div>
        </Container>
    );
}

export default DocPreview;