import {useState} from "react";
import DialogDiv from "../../../../common/DialogDiv.jsx";
import {Button, TextField} from "@mui/material";
import {notifyMsg} from "../../../../../utils/CommonUtils.js";
import {dialogProxy} from "../../../../../utils/DialogContainer.jsx";
import {moveFile} from "../../utils/WebDavUtils.js";

function RenameFile({path, name}) {

    const [loading, setLoading] = useState(false)
    const [newName, setNewName] = useState(name)

    return (
        <DialogDiv className={'shadow'}>
            <h4 className={'no-select'}>重命名文件</h4>
            <div class="content">
                <TextField label={'文件名称'} variant={'outlined'} value={newName} onChange={(event) => {
                    setNewName(event.target.value.trim())
                }}/>
            </div>
            <Button variant={'contained'} disabled={loading} onClick={async () => {
                setLoading(true)
                try {
                    await moveFile(`api${path}/${name}`, `api${path}/${encodeURIComponent(newName)}`)
                    notifyMsg('重命名文件成功')
                    dialogProxy.pop()
                } finally {
                    setLoading(false)
                }
            }}>重命名文件</Button>
        </DialogDiv>
    );
}

export default RenameFile;