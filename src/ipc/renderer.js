export async function getData(args) {
    return await window.ipcRenderer.invoke("get-data", args)
}

