import styled from "styled-components";
import {addDialog, dialogList} from "../../utils/DialogContainer.jsx";
import {useState} from "react";
import LoadingButton from "./LoadingButton.jsx";

const Container = styled.div`
    display: flex;
    background-color: white;
    padding: 10px;
    border-radius: 10px;
    justify-content: center;
    width: 500px;
    max-width: 95vw;
    gap: 10px;
    flex-direction: column;
    color: #8e2afe;
    word-break: break-all;

    > .content {
        padding: 20px;
        gap: 20px;
        display: flex;
        max-height: 60vh;
        overflow-y: auto;
        width: 100%;
        //justify-content: center;
    }

    p {
        white-space: nowrap;
        font-weight: bold;
    }

    button {
        font-size: max(.6rem, 14px);
    }
`


export function showConfirmWindow(title, onConfirm, onCancel) {
    addDialog(<ConfirmWindow title={title} onConfirm={onConfirm} onCancel={onCancel}/>)
}


function ConfirmWindow({title, onConfirm, onCancel}) {

    const [disabled, setDisabled] = useState(false);


    return (
        <Container className={'shadow'}>
            <h4 className={'no-select'}>{title}</h4>
            <div class="content">
                <LoadingButton
                    variant={'contained'}
                    disabled={disabled}
                    onClick={async () => {
                        setDisabled(true)
                        dialogList.pop()
                        await onConfirm?.()
                    }}>
                    确认<
                /LoadingButton>

                <LoadingButton
                    variant={'outlined'}
                    disabled={disabled}
                    onClick={async () => {
                        setDisabled(true)
                        dialogList.pop()
                        await onCancel?.()
                    }}>
                    取消
                </LoadingButton>
            </div>

        </Container>

    );
}

export default ConfirmWindow;
