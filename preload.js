const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  ping: () => ipcRenderer.invoke('ping')
});

ipcRenderer.on('ping', () => {
  console.log('Ping received from renderer');
});