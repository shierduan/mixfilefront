import {useEffect, useState} from "react";
import {apiAddress} from "../../../config.js";
import {Button, CircularProgress} from "@mui/material";
import {fetchMixGzipTextData, formatFileSize, notifyMsg} from "../../../utils/CommonUtils.js";
import {CopyToClipboard} from "react-copy-to-clipboard/src";
import {addDialog} from "../../../utils/DialogContainer.jsx";
import {List} from "react-virtualized";
import {resolveMixFile} from "../FileResolve.jsx";
import {MixFileChip, MixFileDataContainer} from "./StyleContainers.jsx";


function FileListDialog({data}) {


    const [fileList, setList] = useState([])
    // console.log(fileList)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        (async () => {
            const textData = await fetchMixGzipTextData(data)
            setList(JSON.parse(textData))
            setLoading(false)
        })()
    }, [data]);

    function rowRenderer({
                             index, // Index of row
                             isScrolling, // The List is currently being scrolled
                             isVisible, // This row is visible within the List (eg it is not an overscanned row)
                             key, // Unique key within array of rendered rows
                             parent, // Reference to the parent List (instance)
                             style, // Style object to be applied to row (to position it);
                             // This must be passed through to the rendered row element.
                         }) {
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

    let content = <CircularProgress/>
    if (!loading) {
        content = <List
            width={480}
            height={window.innerHeight / 2}
            rowCount={fileList.length}
            rowHeight={100}
            rowRenderer={rowRenderer}
        />
    }

    return (
        <MixFileDataContainer className={'shadow'}>
            <h3>共{fileList.length}个文件</h3>
            <div class="content">
                {content}
            </div>
            <CopyToClipboard text={`mf://${data}`} onCopy={() => {
                notifyMsg('复制成功!', {toastId: 'copy-to-clipboard'})
            }}>
                <Button variant={'outlined'}>复制分享码</Button>
            </CopyToClipboard>
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