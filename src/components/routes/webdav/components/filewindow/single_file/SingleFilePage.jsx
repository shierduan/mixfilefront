import {useLocation} from "react-router-dom";
import styled from "styled-components";
import {copyText, formatFileSize} from "../../../../../../utils/CommonUtils.jsx";
import {PhotoProvider, PhotoView} from "react-photo-view";
import DocPreview from "./DocPreview.jsx";


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
        padding: 50px 0;
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        gap: 50px;

        .preview {
            overflow: hidden;
            display: flex;
            justify-content: center;
            align-items: center;

            img {
                border-radius: 10px;
                max-width: 80%;
                max-height: 50vh;
                filter: drop-shadow(0px 1px 6px rgba(0, 0, 0, 0.2));
            }

            .doc-view {
                min-height: 500px;
                width: 100%;
                height: 100%;
            }
        }

        > .info-content {
            display: flex;
            flex-direction: column;
            border-radius: 10px;
            overflow: hidden;

            h4 {
                padding: 10px;
                color: white;
                width: 100%;
                background-color: #ae6afa;
            }

            > .infos {
                display: flex;
                flex-direction: column;
                gap: 10px;
                padding: 10px;

                > .info-item {
                    display: flex;
                    flex-direction: column;

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
        }
    }
`

function SingleFilePage({file}) {
    const {name, size, etag, url, mimeType} = file;

    const path = useLocation().pathname

    const infos = {
        '名称': {
            value: name,
            onClick() {
                copyText(name)
            },
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

    let filePreview = null

    if (mimeType.startsWith("image/")) {
        filePreview = (
            <PhotoProvider maskClosable={true} maskOpacity={0.5}>
                <PhotoView src={url}>
                    <img src={url} alt={name}/>
                </PhotoView>
            </PhotoProvider>
        )
    }

    //audio
    if (mimeType.startsWith("audio/")) {
        filePreview = (
            <audio src={url} controls/>
        )
    }

    if (mimeType === 'application/pdf') {
        filePreview = (
            <iframe src={url} width="100%" height="600px"></iframe>
        )
    }
    const docSuffixes = ['.doc', '.docx']

    if (docSuffixes.some((suffix) => name.endsWith(suffix))) {
        filePreview = (
            <DocPreview file={file}/>
        )
    }


    return (
        <Container>
            <div class="content">
                <div className={'preview'}>
                    {filePreview}
                </div>
                <div class="info-content shadow">
                    <h4 className={'no-select'}>文件信息</h4>
                    <div class="infos">
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
            </div>
        </Container>
    );
}

export default SingleFilePage;