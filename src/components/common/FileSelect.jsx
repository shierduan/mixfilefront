let callback = () => {
}


export async function selectFiles() {
    document.querySelector('#select-components').click()
    return new Promise((resolve, reject) => {
        callback = resolve
    })
}

function FileSelect(props) {
    return (
        <input type="file" id={'select-components'} hidden onChange={async (event) => {
            const target = event.target
            const files = [...target.files]
            callback(files);
            target.value = ''
        }} multiple="multiple"/>
    );
}

export default FileSelect;