import {useState} from 'react';
import {Button, TextField} from "@mui/material";
import {getFormattedDate} from "../../../../../utils/CommonUtils.js";
import {apiAddress, client} from "../../../../../config.js";
import {openFileListDialog} from "../../../../mixformats/FileList.jsx";
import pako from "pako";
import DialogDiv from "../../../../common/DialogDiv.jsx";


function FileExportDialog({fileList}) {


    const [uploading, setUploading] = useState(false)
    const [listName, setListName] = useState(`文件分享-${getFormattedDate()}`)

    return (
        <DialogDiv className={'shadow'}>
            <h4>导出文件列表</h4>
            <div class="content">
                <TextField label={'文件列表名称'} variant={'outlined'} value={listName} onChange={(event) => {
                    setListName(event.target.value.trim())
                }}/>
            </div>
            <Button variant={'contained'} disabled={uploading} onClick={async () => {
                const dataList = fileList.map(({name, size, shareInfoData}) => {
                    return {
                        name,
                        size,
                        category: '',
                        time: new Date().getTime(),
                        shareInfoData
                    }
                })
                const shareData = pako.gzip(JSON.stringify(dataList))
                const uploadAddress = `${apiAddress}api/upload?name=${encodeURIComponent(`${listName}.mix_list`)}&add=false`
                setUploading(true)
                try {
                    let response = await client.put(uploadAddress, shareData)
                    openFileListDialog(response.data)
                } finally {
                    setUploading(false)
                }
            }}>确认导出</Button>
        </DialogDiv>

    );
}

export default FileExportDialog;
