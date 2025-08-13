import styled from "styled-components";
import {FileDrop} from "react-file-drop";
import {selectFiles} from "../../../common/FileSelect.jsx";

const Container = styled.div`
    display: flex;
    flex-wrap: wrap;
    width: 100%;
    height: 100px;
    align-items: center;
    justify-content: center;
    font-size: min(2rem, 100px);
    cursor: pointer;
    color: rgba(138, 43, 226, 0.76);
    font-weight: bold;
    border: 4px dashed rgba(142, 42, 254, 0.63);
    transition: .3s;
    box-shadow: 0 0 5px 3px rgba(138, 43, 226, 0.15);
    word-break: break-all;

    &:hover {
        background-color: rgba(138, 43, 226, 0.1);
    }

    .file-drop {
        width: 100%;
        height: 100%;
        user-select: none;
    }

    .file-drop-target {
        filter: drop-shadow(2px 2px 4px rgba(174, 107, 239, 0.2));
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 100%;
        transition: .3s;
    }

    .file-drop-target.file-drop-dragging-over-frame {
        /* overlay a black mask when dragging over the frame */
        border: none;
        background-color: rgba(138, 43, 226, 0.1);
        z-index: 50;
        opacity: 1;
    }

    .file-drop-target.file-drop-dragging-over-target {
        /* turn stuff orange when we are dragging over the target */
        color: blueviolet;
        box-shadow: 0 0 13px 3px blueviolet;
    }
`

function UploadArea({callback}) {
    return (
        <Container>
            <FileDrop
                onTargetClick={async () => {
                    const files = await selectFiles()
                    callback?.(files)
                }}
                onDrop={(files, event) => {
                    callback?.(files)
                }}
            >
                选择/拖入文件
            </FileDrop>
        </Container>
    );
}

export default UploadArea;
