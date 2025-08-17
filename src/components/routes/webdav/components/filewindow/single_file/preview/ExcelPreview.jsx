import styled from "styled-components";
import ExcelViewer from "excel-viewer";
import useApi from "../../../../../../../hooks/useApi.jsx";

const Container = styled.div`
    max-width: 100%;
`

function ExcelPreview({file}) {
    const {name, url} = file


    useApi({
        path: url,
        config: {
            responseType: "arraybuffer",
        },
        callback: async (data) => {
            new ExcelViewer(".excel-preview", data, {
                theme: "dark",
                lang: "zh_cn"
            });
        },
    })

    return (
        <Container className={'excel-preview'}>

        </Container>
    );
}

export default ExcelPreview;