import {useState} from "react";
import DialogDiv from "../../../../common/DialogDiv.jsx";
import {Button, TextField} from "@mui/material";
import {client} from "../../../../../config.js";
import {notifyMsg} from "../../../../../utils/CommonUtils.js";
import {dialogProxy} from "../../../../../utils/DialogContainer.jsx";

function RenameFile({path}) {
    const [loading, setLoading] = useState(false)
    const [folderName, setFolderName] = useState(`新建文件夹`)

    return (
        <DialogDiv className={'shadow'}>
            <h4>重命名文件</h4>
            <div class="content">
                <TextField label={'文件夹名称'} variant={'outlined'} value={folderName} onChange={(event) => {
                    setFolderName(event.target.value.trim())
                }}/>
            </div>
            <Button variant={'contained'} disabled={loading} onClick={async () => {
                setLoading(true)
                try {
                    await client({
                        method: 'MKCOL',
                        url: `api${path}/${folderName}`
                    })
                    notifyMsg('新建文件夹成功')
                    dialogProxy.pop()
                } finally {
                    setLoading(false)
                }
            }}>新建文件夹</Button>
        </DialogDiv>
    );
}

export default RenameFile;