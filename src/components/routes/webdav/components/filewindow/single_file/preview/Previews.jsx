import {PhotoProvider, PhotoView} from "react-photo-view";
import DocPreview from "./DocPreview.jsx";
import ExcelPreview from "./ExcelPreview.jsx";

export function FilePreview({file}) {
    const {mimeType, name, url} = file

    if (mimeType.startsWith("image/")) {
        return (
            <PhotoProvider maskClosable={true} maskOpacity={0.5}>
                <PhotoView src={url}>
                    <img src={url} alt={name}/>
                </PhotoView>
            </PhotoProvider>
        )
    }

    //audio
    if (mimeType.startsWith("audio/")) {
        return (
            <audio src={url} controls/>
        )
    }

    if (mimeType === 'application/pdf') {
        return (
            <iframe src={url} width="100%" height="600px"></iframe>
        )
    }

    const docSuffixes = ['.doc', '.docx']

    if (docSuffixes.some((suffix) => name.endsWith(suffix))) {
        return (
            <DocPreview file={file}/>
        )
    }

    const excelSuffixes = [
        // Excel
        '.xlsx',
        '.xlsm',
        '.xlsb',
        '.xls',

        // OpenDocument
        '.ods',

        // Delimited / plain text
        '.csv',

        // Other
        '.sylk',
        '.dbf',
    ];

    if (excelSuffixes.some((suffix) => name.endsWith(suffix))) {
        return (
            <ExcelPreview file={file}/>
        )
    }

    return null
}