const { contextBridge, ipcRenderer } = require('electron');
contextBridge.exposeInMainWorld('electronAPI', {
  onTrayCmd:  (cb) => ipcRenderer.on('tray-cmd', (e, cmd) => cb(cmd)),
  nowPlaying: (info) => ipcRenderer.send('now-playing', info),
  closeApp:   () => ipcRenderer.send('close-app'),
  hideApp:    () => ipcRenderer.send('hide-app')
});
