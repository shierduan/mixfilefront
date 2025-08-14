import {useLocation} from "react-router-dom";
import styled from "styled-components";
import {formatFileSize} from "../../../../../utils/CommonUtils.jsx";

const Container = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    padding: 10px;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    gap: 20px;

    .info {
        width: 80%;
        height: 50%;
        border-radius: 10px;
        overflow: hidden;

        .info-content {
            display: flex;
            flex-direction: column;
            padding: 10px;
            gap: 10px;

            span {
                white-space: nowrap;
                text-overflow: ellipsis;
                max-width: 100%;
                overflow: hidden;
                cursor: text;
            }
        }

        h4 {
            padding: 10px;
            color: white;
            width: 100%;
            background-color: #ae6afa;
        }
    }
`

function SingleFilePage({file}) {
    const {name, size, etag} = file;

    const path = useLocation().pathname

    return (
        <Container>
            <h3>{name}</h3>
            <div class="info shadow">
                <h4>文件信息</h4>
                <div class="info-content">
                    <span>大小: {formatFileSize(size)}</span>
                    <span>分享码: {etag}</span>
                </div>
            </div>
        </Container>
    );
}

export default SingleFilePage;