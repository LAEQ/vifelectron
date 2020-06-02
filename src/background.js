// This is main process of Electron, started as first thing when your
// app starts. It runs through entire life of your application.
// It doesn't have any windows which you can see on screen, but we can open
// window from here.

import path from "path";
import url from "url";
import { app, Menu, remote } from "electron";
import { devMenuTemplate } from "./menu/dev_menu_template";
import { editMenuTemplate } from "./menu/edit_menu_template"
import { videoMenuTemplate} from "./menu/video_menu_template";
import createWindow from "./helpers/window";


// Special module holding environment variables which you declared
// in config/env_xxx.json file.
import env from "env";
import Settings from "./helpers/initialize";

if(env.name === "development"){
  require('electron-reload')(__dirname, {
    electron: path.join(__dirname, 'nodes_modules', '.bin', 'electron')
  })
}

let setting = new Settings();

const setApplicationMenu = () => {
  const menus = [videoMenuTemplate, editMenuTemplate];
  if (env.name !== "production") {
    menus.push(devMenuTemplate);
  }
  Menu.setApplicationMenu(Menu.buildFromTemplate(menus));
};

if (env.name !== "production") {
  const userDataPath = app.getPath("userData");
  app.setPath("userData", `${userDataPath} (${env.name})`);
}

const ipcMain = require('electron').ipcMain


// Caegory section
ipcMain.on('category:open', _ => {
  let categoryWindow = createWindow("category", {
    width: 1000,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  })

  categoryWindow.setMenu(null);
  // categoryWindow.webContents.openDevTools()
  categoryWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, "category.html"),
      protocol: "file",
      slashes: true
    })
  ).then( _ => {}).catch(err => console.log(err))
})

//Video editor
ipcMain.on('editor:open', (event, args) => {
  let editorWindow = createWindow("editor", {
    width: 1000,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  });

  editorWindow.setMenu(null);
  editorWindow.webContents.openDevTools()
  editorWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, "editor.html"),
      protocol: "file",
      slashes: true,
      query: {videoId: args}
    })
  ).catch(err => {
    console.log(err)
  })

})
ipcMain.on('video:tool', (event, args) => {
  let videoToolWindow = createWindow("tool", {
    width: 1000,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  });

  videoToolWindow.setMenu(null);
  videoToolWindow.webContents.openDevTools()
  videoToolWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, "tool.html"),
      protocol: "file",
      slashes: true,
      query: {videoId: args}
    })
  ).catch(err => {
    console.log(err)
  })
})

//Category
ipcMain.on('category:create', (event, category) => {
  console.log(category)
})

// Controls video editor
ipcMain.on('controls:show-hide', _ => {
  let controlWindow = createWindow("controls", {
    width: 350,
    height: 800,
    webPreferences: {
      nodeIntegration: true
    }
  });

  controlWindow.webContents.openDevTools()

  controlWindow.setMenu(null)
  controlWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, "controls.html"),
      protocol: "file",
      slashes: true
    })
  ).catch(err => { console.log(err)})
})

// Ready state
app.on("ready", () => {
  setApplicationMenu();

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

  }).catch(err => console.log(err))

  // if (env.name === "development") {
    mainWindow.openDevTools();
  // }
});

//Closing application
app.on("window-all-closed", () => {
  app.quit();
});

