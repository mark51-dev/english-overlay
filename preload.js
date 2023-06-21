const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electron', {
    onTextToTranslate: (title) => ipcRenderer.send('textToTranslate', title),
    onUpdateTranslatedResult: (callback) => ipcRenderer.on('onUpdateTranslateResult', callback)
})