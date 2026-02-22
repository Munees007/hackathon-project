const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  onMinimize: (callback) => ipcRenderer.on("window-minimized", callback),
  onRestore: (callback) => ipcRenderer.on("window-restored", callback),
  onBlur: (callback) => ipcRenderer.on("window-blur", callback),
  onFocus: (callback) => ipcRenderer.on("window-focus", callback),
});