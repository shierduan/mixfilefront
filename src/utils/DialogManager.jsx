import {proxy, useSnapshot} from "valtio";
import {Backdrop} from "@mui/material";

export const dialogProxy = proxy([])

export function addDialog(dialog, autoClose = true) {
    dialogProxy.push({
        content: () => dialog,
        autoClose,
    })
}

export function DialogManager(props) {

    let dialogState = useSnapshot(dialogProxy)

    if (dialogState.length === 0) {
        return null
    }

    return dialogState.map((item, index) => {
        return <Backdrop open onClick={(event, key = index) => {
            if (event.target === event.currentTarget && item.autoClose) {
                dialogProxy.pop()
            }
        }} style={{
            zIndex: '99'
        }}>
            {item.content()}
        </Backdrop>
    })
}