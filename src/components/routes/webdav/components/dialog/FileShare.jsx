import useProxyState from "../../../../../hooks/useProxyState.js";
import DialogDiv from "../../../../common/DialogDiv.jsx";
import {TextField} from "@mui/material";
import LoadingButton from "../../../../common/LoadingButton.jsx";
import {
    compressGzip,
    copyText,
    getRoutePath,
    notifyPromise,
    substringAfterLast
} from "../../../../../utils/CommonUtils.jsx";
import {dialogList} from "../../../../../utils/DialogContainer.jsx";
import {apiAddress, client} from "../../../../../config.js";
import {webDavState} from "../../state/WebDavState.js";

export async function shareSelectedFiles(name) {
    const downloadPath = `api/${getRoutePath()}/当前目录存档.mix_dav?response-content-encoding=gzip`
    const response = await client.get(downloadPath)
    const jsonData = JSON.parse(response.data.substring(4))
    const selectedNames = new Set(webDavState.selectedFiles.map(file => file.name))
    const {files} = jsonData
    for (const key in files) {
        if (!selectedNames.has(key)) {
            delete files[key]
        }
    }
    const uploadAddress = `${apiAddress}api/upload?name=${encodeURIComponent(`${name}.mix_dav`)}&add=false`
    const uploadResponse = await client.put(uploadAddress, compressGzip(`V2_:\n${JSON.stringify(jsonData)}`))
    return uploadResponse.data
}

function FileShare(props) {

    const state = useProxyState({
        name: substringAfterLast(getRoutePath(), '/'),
    })

    const {name} = state;


    return (
        <DialogDiv className={'shadow'}>
            <h4 className={'no-select'}>分享文件</h4>
            <div class="content">
                <TextField label={'分享名称'} variant={'outlined'} value={name} onChange={(event) => {
                    state.name = event.target.value.trim()
                }}/>
            </div>
            <LoadingButton variant={'contained'} onClick={async () => {
                const code = await notifyPromise(shareSelectedFiles(name))
                copyText(code)
                dialogList.pop()
            }}>生成分享码</LoadingButton>
        </DialogDiv>
    );
}

export default FileShare;