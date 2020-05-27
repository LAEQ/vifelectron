import BrowserWindow from 'electron'

const videoMenuTemplate = {
  label: "Feature",
  submenu: [
    { label: "Video editor", accelerator: "CmdOrCtrl+V",
      click(){
        BrowserWindow.ipcMain.emit('editor:open')
      }
    },
    { label: "Category", accelerator: "CmdOrCtrl+C",
      click(){
        BrowserWindow.ipcMain.emit('category:open')
      }
    },
    { label: "Collection", accelerator: "CmdOrCtrl+V",
      click(){
        BrowserWindow.ipcMain.emit('collection:open')
      }
    }
  ]
}

export {videoMenuTemplate}
