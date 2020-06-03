import BrowserWindow from "electron";

export const editMenuTemplate = {
  label: "Statistic",
  submenu: [
    {
      label: "Video", accelerator: "CmdOrCtrl+Z", click() {
        BrowserWindow.ipcMain.emit('statistic:video')
      }
    }
  ]
};
