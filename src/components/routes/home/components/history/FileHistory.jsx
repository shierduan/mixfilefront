import styled from "styled-components";
import {addDialog} from "../../../../../utils/DialogContainer.jsx";
import {Button} from "@mui/material";
import FileExportDialog from "../dialog/FileExport.jsx";
import useApi from "../../../../../hooks/useApi.jsx";
import {FileCard} from "./FileCard.jsx";
import {run} from "../../../../../utils/CommonUtils.jsx";

const Container = styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px;
    width: 100%;

    .files {
        overflow: hidden;
        display: flex;
        flex-direction: column;
        gap: 10px;
        width: 100%;
    }

`

function FileHistory(props) {

    const {content} = useApi({
        path: 'api/upload_history',
        refreshInterval: 1000,
        content(data) {
            if (data.length === 0) {
                return null
            }
            const exportButton = run(() => {
                if (data.length > 1) {
                    return (
                        <Button variant={'outlined'} onClick={() => {
                            addDialog(<FileExportDialog fileList={data}/>)
                        }}>
                            导出文件列表
                        </Button>
                    )
                }
            })

            return <Container>
                {exportButton}
                <div class="files shadow">
                    {data.map((item) => <FileCard item={item} key={item.shareInfoData}/>)}
                </div>
            </Container>
        }
    })


    return (
        <>
            {content}
        </>
    );
}

export default FileHistory;
