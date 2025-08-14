import {proxy} from "valtio";
import {compareByName, noProxy} from "../../../../utils/CommonUtils.jsx";

const isFolderFirst = (a, b) => a.isFolder === b.isFolder ? 0 : a.isFolder ? -1 : 1;

export const FILE_SORTS = {
    name: {
        func: (a, b) => isFolderFirst(a, b) || compareByName(a.name, b.name)
    },
    size: {
        func: (a, b) => isFolderFirst(a, b) || a.size - b.size
    },
    date: {
        func: (a, b) => isFolderFirst(a, b) || a.lastModified - b.lastModified
    }
}

export const webDavState = proxy({
    files: [],
    sortedFiles: [],
    selectedFiles: [],
    sort: noProxy(FILE_SORTS.name),
    singleFile: null,
})

