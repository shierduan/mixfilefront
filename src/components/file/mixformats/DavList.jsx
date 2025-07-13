import {useEffect, useState} from "react";
import {apiAddress} from "../../../config.js";
import {Button, CircularProgress} from "@mui/material";
import {fetchMixGzipTextData, formatFileSize, notifyMsg} from "../../../utils/CommonUtils.js";
import {CopyToClipboard} from "react-copy-to-clipboard/src";
import {addDialog, dialogProxy} from "../../../utils/DialogContainer.jsx";
import {List} from "react-virtualized";
import {resolveMixFile} from "../FileResolve.jsx";
import {MixFileChip, MixFileDataContainer} from "./StyleContainers.jsx";

function FileDavDialog({data}) {

    const [davFile, setDavFile] = useState({})


    const [currentFile, setCurrentFile] = useState({})

    let currentFiles = Object.values(currentFile.files ?? {})

    const [loading, setLoading] = useState(true)

    const [pathHistory, setPathHistory] = useState([])


    useEffect(() => {

        history.pushState(null, null, location.href);

        const listener = function (event) {
            history.pushState(null, null, location.href);
            if (pathHistory.length > 0) {
                setCurrentFile(pathHistory.pop())
            }
        }

        window.addEventListener('popstate', listener);

        return () => {
            window.removeEventListener('popstate', listener)
        }
    }, [pathHistory, setCurrentFile]);

    useEffect(() => {
        setCurrentFile(davFile)
    }, [davFile]);


    useEffect(() => {
        setDavFile([]);
        (async () => {
            const textData = await fetchMixGzipTextData(data)
            setDavFile(JSON.parse(textData.substring(5)))
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
        const file = currentFiles[index];


        const {name, size, time, shareInfoData, isFolder} = file

        let description = <p>{formatFileSize(size)}</p>
        if (isFolder) {
            description = <p>文件夹</p>
        }

        return (
            <MixFileChip key={key} style={style} onClick={() => {
                if (isFolder) {
                    // return openFileDavDialog(null, file)
                    setPathHistory((prev) => [...prev, currentFile])
                    return setCurrentFile(file ?? {})
                }
                resolveMixFile(shareInfoData)
            }}>
                <div class="content shadow">
                    <h4 className={'text-hide'}>{name}</h4>
                    {description}
                </div>
            </MixFileChip>
        );
    }


    let content = <CircularProgress/>
    if (!loading) {
        content = <List
            width={480}
            height={window.innerHeight / 2}
            rowCount={currentFiles.length}
            rowHeight={100}
            rowRenderer={rowRenderer}
        />
    }

    let topButton = <Button variant={'outlined'} onClick={() => {
        dialogProxy.pop()
    }}>关闭</Button>

    if (pathHistory.length > 0) {
        topButton = <Button variant={'outlined'} onClick={() => {
            setCurrentFile(pathHistory.pop())
        }}>上一级</Button>
    }


    return (
        <MixFileDataContainer className={'shadow'}>
            <h3>{[...pathHistory, currentFile].map((it) => it.name).join("/")} 共{currentFiles.length}个文件</h3>
            {topButton}
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
            }}>下载存档文件</Button>
        </MixFileDataContainer>
    );
}

export function openFileDavDialog(file) {
    addDialog(<FileDavDialog data={file}/>, false)
}

export default FileDavDialog;