window.ipcRenderer = require('electron').ipcRenderer;
window.fs = require('fs');
window.shell = require('electron').shell;
console.log(window.shell)
const _tempdir = process.env.TEMP
console.log(_tempdir)
process.once('loaded', () => {
    window.tempdir = _tempdir
    console.log(window.tempdir)
})