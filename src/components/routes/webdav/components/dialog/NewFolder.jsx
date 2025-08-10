import {Button, TextField} from "@mui/material";
import {useState} from "react";
import {useLocation} from "react-router-dom";
import {dialogProxy} from "../../../../../utils/DialogContainer.jsx";
import DialogDiv from "../../../../common/DialogDiv.jsx";
import {notifyMsg} from "../../../../../utils/CommonUtils.js";
import {createFolder} from "../../utils/WebDavUtils.js";

function NewFolder(props) {

    const path = useLocation().pathname

    const [loading, setLoading] = useState(false)
    const [folderName, setFolderName] = useState(`新建文件夹`)

    return (
        <DialogDiv className={'shadow'}>
            <h4>新建文件夹</h4>
            <div class="content">
                <TextField label={'文件夹名称'} variant={'outlined'} value={folderName} onChange={(event) => {
                    setFolderName(event.target.value.trim())
                }}/>
            </div>
            <Button variant={'contained'} disabled={loading} onClick={async () => {
                setLoading(true)
                try {
                    await createFolder(`api${path}/${folderName}`)
                    notifyMsg('新建文件夹成功')
                    dialogProxy.pop()
                } finally {
                    setLoading(false)
                }
            }}>新建文件夹</Button>
        </DialogDiv>
    );
}

export default NewFolder;