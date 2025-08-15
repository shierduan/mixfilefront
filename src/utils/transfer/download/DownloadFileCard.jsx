import {useSnapshot} from "valtio";
import {TransferFileCard} from "../components/TransferFileCard.jsx";
import {LinearProgressWithLabel} from "../components/Progress.jsx";

export function DownloadFileCard({file: dFile}) {

    const {tip, progress, cancel, title, error, complete} = useSnapshot(dFile)

    const classes = []

    if (error) {
        classes.push('error')
    }

    return <TransferFileCard className={`shadow no-select ${classes.join(' ')}`}>
        <h4 className={'text-hide'}>{title}</h4>
        {!complete && <LinearProgressWithLabel value={progress}/>}
        <p>{tip}</p>
    </TransferFileCard>
}
