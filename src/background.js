// This is main process of Electron, started as first thing when your
// app starts. It runs through entire life of your application.
// It doesn't have any windows which you can see on screen, but we can open
// window from here.

import path from "path";
import url from "url";
import jetpack from "fs-jetpack";
import { app, Menu } from "electron";
import { devMenuTemplate } from "./menu/dev_menu_template";
import { editMenuTemplate } from "./menu/edit_menu_template"
import { videoMenuTemplate} from "./menu/video_menu_template";
import createWindow from "./helpers/window";



require('electron-reload')(__dirname, {
  electron: path.join(__dirname, 'nodes_modules', '.bin', 'electron')
})


// Special module holding environment variables which you declared
// in config/env_xxx.json file.
import env from "env";
import Settings from "./helpers/initialize";

const setApplicationMenu = () => {
  const menus = [videoMenuTemplate, editMenuTemplate];
  if (env.name !== "production") {
    menus.push(devMenuTemplate);
  }
  Menu.setApplicationMenu(Menu.buildFromTemplate(menus));
};

// Save userData in separate folders for each environment.
// Thanks to this you can use production and development versions of the app
// on same machine like those are two separate apps.
if (env.name !== "production") {
  const userDataPath = app.getPath("userData");
  app.setPath("userData", `${userDataPath} (${env.name})`);
}

const ipcMain = require('electron').ipcMain

ipcMain.on('test', _ => {
  let categoryWindow = createWindow("category", {
    width: 1000,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  })

  categoryWindow.setMenu(null);
  categoryWindow.webContents.openDevTools()

  categoryWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, "category.html"),
      protocol: "file",
      slashes: true
    })
  ).then( _ => {

  });

})

ipcMain.on('category:create', (event, path) => {
  console.log(path)

})

const init = _ => {

}

app.on("ready", () => {
  setApplicationMenu();

  // const homeDir = path.join(require('os').homedir(), 'vifeco')
  // let dirs = ['db', 'icons', 'category']
  // dirs = dirs.map( d => path.join(homeDir, d))
  // console.log(dirs)
  // dirs.forEach(d => jetpack.dir(d))

  const settings = new Settings()
  settings.init()

  const mainWindow = createWindow("main", {
    width: 1000,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  });

  mainWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, "app.html"),
      protocol: "file:",
      slashes: true
    })
  ).then( _ => {

  });

  if (env.name === "development") {
    mainWindow.openDevTools();
  }
});

app.on("window-all-closed", () => {
  app.quit();
});

