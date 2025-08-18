import {useSnapshot} from "valtio";
import {resolveMixFile} from "../../../components/common/base/FileResolve.jsx";
import {TransferFileCard} from "../components/TransferFileCard.jsx";
import {LinearProgressWithLabel} from "../components/Progress.jsx";


export function UploadFileCard({file: upFile}) {

    const {tip, progress, cancel, title, error, result, file, complete} = useSnapshot(upFile)

    const classes = []

    if (error) {
        classes.push('error')
    }
    if (result) {
        classes.push('done')
    }

    return <TransferFileCard className={`shadow no-select ${classes.join(' ')}`} onClick={() => {
        if (result) {
            resolveMixFile(result)
        }
    }}>
        <h4 className={'text-hide'}>{title}</h4>
        {!complete && <LinearProgressWithLabel value={progress}/>}
        <p>{tip}</p>
    </TransferFileCard>
}
