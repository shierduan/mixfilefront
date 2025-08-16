import {apiAddress} from "../../config.js";
import {Button} from "@mui/material";
import {compareByName, copyText, formatFileSize} from "../../utils/CommonUtils.jsx";
import {addDialog} from "../../utils/DialogContainer.jsx";
import {resolveMixFile} from "../routes/home/components/FileResolve.jsx";
import {MixFileChip, MixFileDataContainer} from "./StyleContainers.jsx";
import useApi from "../../hooks/useApi.jsx";
import VirtualList from "../common/VirtualList.jsx";


function FileListDialog({data}) {


    const {content} = useApi({
        path: `api/download?s=${data}&response-content-encoding=gzip`,
        content(fileList) {

            fileList.sort((a, b) => compareByName(a.name, b.name))

            return <>
                <h3 className={'no-select'}>共{fileList.length}个文件</h3>
                <div class="content">
                    <VirtualList
                        rowCount={fileList.length}
                        rowHeight={100}
                        rowRenderer={(ctx) => {
                            const {
                                index, // Index of row
                                isScrolling, // The List is currently being scrolled
                                isVisible, // This row is visible within the List (eg it is not an overscanned row)
                                key, // Unique key within array of rendered rows
                                parent, // Reference to the parent List (instance)
                                style, // Style object to be applied to row (to position it);
                                // This must be passed through to the rendered row element.
                            } = ctx
                            const file = fileList[index];


                            const {name, size, time, shareInfoData} = file
                            return (
                                <MixFileChip key={key} style={style} onClick={() => {
                                    resolveMixFile(shareInfoData)
                                }}>
                                    <div class="content shadow">
                                        <h4 className={'text-hide'}>{name}</h4>
                                        <p>{formatFileSize(size)}</p>
                                    </div>
                                </MixFileChip>
                            );
                        }
                        }
                    />
                </div>
            </>
        }
    })


    return (
        <MixFileDataContainer className={'shadow'}>
            {content}
            <Button variant={'outlined'} onClick={() => {
                copyText(`mf://${data}`)
            }}>复制分享码</Button>
            <Button variant={'contained'} onClick={() => {
                window.open(`${apiAddress}api/download?s=${encodeURIComponent(data)}`)
            }}>下载列表文件</Button>
        </MixFileDataContainer>
    );
}

export function openFileListDialog(file) {
    addDialog(<FileListDialog data={file}/>)
}

export default FileListDialog;