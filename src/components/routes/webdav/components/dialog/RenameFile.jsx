import DialogDiv from "../../../../common/DialogDiv.jsx";
import {Checkbox, FormControlLabel, TextField} from "@mui/material";
import {notifyError, notifyMsg} from "../../../../../utils/CommonUtils.js";
import {dialogProxy} from "../../../../../utils/DialogContainer.jsx";
import {moveFile} from "../../utils/WebDavUtils.js";
import useProxyState from "../../../../../hooks/useProxyState.js";
import LoadingButton from "../../../../common/LoadingButton.jsx";

function RenameFile({path, name}) {

    const state = useProxyState({
        newName: name,
        overwrite: false,
    })

    const {newName, overwrite} = state;


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
            <LoadingButton variant={'contained'} onClick={async () => {
                if (name === newName) {
                    notifyError('文件名称相同')
                    return
                }
                await moveFile(`api${path}/${name}`, `api${path}/${newName}`, overwrite)
                notifyMsg('重命名文件成功')
                dialogProxy.pop()
            }}>重命名文件</LoadingButton>
        </DialogDiv>
    );
}

export default RenameFile;