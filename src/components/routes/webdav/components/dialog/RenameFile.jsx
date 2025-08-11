import DialogDiv from "../../../../common/DialogDiv.jsx";
import {Button, Checkbox, FormControlLabel, TextField} from "@mui/material";
import {notifyError, notifyMsg, notifyPromise} from "../../../../../utils/CommonUtils.js";
import {dialogProxy} from "../../../../../utils/DialogContainer.jsx";
import {moveFile} from "../../utils/WebDavUtils.js";
import useProxyState from "../../../../../hooks/useProxyState.js";

function RenameFile({path, name}) {

    const state = useProxyState({
        loading: false,
        newName: name,
        overwrite: false,
    })

    const {loading, newName, overwrite} = state;


    return (
        <DialogDiv className={'shadow'}>
            <h4 className={'no-select'}>重命名文件</h4>
            <div class="content">
                <TextField label={'文件名称'} variant={'outlined'} value={newName} onChange={(event) => {
                    state.newName = event.target.value.trim()
                }}/>
                <FormControlLabel
                    className={'no-select'}
                    control={
                        <Checkbox
                            onChange={(event) => {
                                state.overwrite = event.target.checked;
                            }}
                        />
                    }
                    label="覆盖文件"
                />
            </div>
            <Button variant={'contained'} disabled={loading} onClick={async () => {
                if (name === newName) {
                    notifyError('文件名称相同')
                    return
                }
                state.loading = true
                try {
                    const task = moveFile(`api${path}/${name}`, `api${path}/${newName}`, overwrite)
                    await notifyPromise(task, '重命名文件')
                    notifyMsg('重命名文件成功')
                    dialogProxy.pop()
                } finally {
                    state.loading = false
                }
            }}>重命名文件</Button>
        </DialogDiv>
    );
}

export default RenameFile;