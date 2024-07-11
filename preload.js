const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld(
  "API", {
    ligaled: () => ipcRenderer.send('ligaled'),
    desligaled: () => ipcRenderer.send('desligaled'),
    estadoled: async () => {
        return await ipcRenderer.invoke('qualestadoled');
    }
  }
);
