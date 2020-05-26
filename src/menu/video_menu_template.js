import BrowserWindow from 'electron'

const videoMenuTemplate = {
  label: "Feature",
  submenu: [
    { label: "Video", accelerator: "CmdOrCtrl+V",
      click(){

      }
    },
    { label: "Collection", accelerator: "CmdOrCtrl+C",
      click(){
        BrowserWindow.ipcMain.emit('test')
      }
    }
  ]
}

export {videoMenuTemplate}
