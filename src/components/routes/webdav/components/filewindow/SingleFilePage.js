import {useLocation} from "react-router-dom";
import styled from "styled-components";
import {copyText, formatFileSize} from "../../../../../utils/CommonUtils.jsx";

const Container = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    padding: 10px;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    gap: 20px;

    > .content {
        width: 80%;
        height: 50%;
        border-radius: 10px;
        overflow: hidden;

        > .info-content {
            display: flex;
            flex-direction: column;
            padding: 10px;
            gap: 10px;

            > .info-item {
                display: flex;
                flex-direction: column;
                gap: 5px;

                .name {
                    font-weight: bold;
                    color: #a632f9;
                }

                .value {
                    white-space: nowrap;
                    text-overflow: ellipsis;
                    overflow: hidden;
                    cursor: text;
                }

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
    const {name, size, etag, url} = file;

    const path = useLocation().pathname

    const infos = {
        '名称': {
            value: name
        },
        '大小': {
            value: formatFileSize(size)
        },
        '链接': {
            onClick() {
                copyText(url)
            },
            value: url
        },
        '分享码': {
            onClick() {
                copyText(etag)
            },
            value: etag
        },
    }

    return (
        <Container>
            <h3>{name}</h3>
            <div class="content shadow">
                <h4>文件信息</h4>
                <div class="info-content">
                    {
                        Object.keys(infos).map(item => {
                            return (
                                <div key={item} className={'info-item no-select'} onClick={infos[item].onClick}>
                                    <div className={'name'}>
                                        {item}:
                                    </div>
                                    <div className={'value'}>
                                        {infos[item].value}
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        </Container>
    );
}

export default SingleFilePage;