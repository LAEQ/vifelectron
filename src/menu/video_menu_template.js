import BrowserWindow from 'electron'

const videoMenuTemplate = {
  label: "Feature",
  submenu: [
    { label: "User", accelerator: "CmdOrCtrl+U",
      click(){
        BrowserWindow.ipcMain.emit('user:open')
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
