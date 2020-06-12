// This is main process of Electron, started as first thing when your
// app starts. It runs through entire life of your application.
// It doesn't have any windows which you can see on screen, but we can open
// window from here.

import path from "path";
import url from "url";
import { app, Menu } from "electron";
import { devMenuTemplate } from "./menu/dev_menu_template";
import { editMenuTemplate } from "./menu/edit_menu_template"
import { videoMenuTemplate} from "./menu/video_menu_template";
import createWindow from "./helpers/window";


// Special module holding environment variables which you declared
// in config/env_xxx.json file.
import env from "env";
import Logger from "./helpers/logger";
import Settings from "./helpers/initialize";

if(env.name === "development"){
  require('electron-reload')(__dirname, {
    electron: path.join(__dirname, 'nodes_modules', '.bin', 'electron')
  })
}

let windows = {}
let setting = new Settings();
let logger = new Logger(setting)

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

// User section
ipcMain.on('user:open', _ => {
  if(windows['user'] === undefined) {
    let userWindow = createWindow("user", {
      width: 1000,
      height: 600,
      webPreferences: {
        nodeIntegration: true
      }
    })

    userWindow.setMenu(null);
    userWindow.loadURL(
      url.format({
        pathname: path.join(__dirname, "user.html"),
        protocol: "file",
        slashes: true
      })
    ).then(_ => {
    }).catch(err => console.log(err))

    userWindow.webContents.openDevTools()
    windows['user'] = userWindow

    if (env.name === "development") {
      userWindow.openDevTools();
    }

    userWindow.on('closed', _ => {
      windows['user'] = null
    })
  }
})

// Category section
ipcMain.on('category:open', _ => {
  let categoryWindow = createWindow("category", {
    width: 1000,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  })

  categoryWindow.setMenu(null);
  categoryWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, "category.html"),
      protocol: "file",
      slashes: true
    })
  ).then( _ => {}).catch(err => console.log(err))

  categoryWindow.webContents.openDevTools()
  windows['category'] = categoryWindow

  if (env.name === "development") {
    categoryWindow.openDevTools();
  }

  categoryWindow.on('closed', _ => {
    windows['category'] = null
  })
})

//Collection
ipcMain.on('collection:open', _ => {
  if(windows['collection']){
    return
  }

  let collectionWindow = createWindow("category", {
    width: 1000,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  })

  collectionWindow.setMenu(null);
  collectionWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, "collection.html"),
      protocol: "file",
      slashes: true
    })
  ).then( _ => {}).catch(err => console.log(err))

  collectionWindow.webContents.openDevTools()
  windows['collection'] = collectionWindow

  if (env.name === "development") {
    collectionWindow.openDevTools();
  }

  collectionWindow.on('closed', _ => {
    windows['collection'] = null
  })
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

  windows['editor'] = editorWindow

  editorWindow.on('close', _ => {
    if(windows['timeline']){
      windows['timeline'].close()
      windows['timeline'] = undefined
    }

    if(windows['controls']){
      windows['controls'].close()
      windows['controls'] = undefined
    }
  })

  if (env.name === "development") {
    editorWindow.openDevTools();
  }

})
ipcMain.on('editor:timeline:toogle', (event, args) => {
  console.log(windows['timeline'])
  if(! windows["timeline"]){
    let timelineWindow = createWindow('timeline', {
      width: 980,
      height: 230,
      webPreferences: {
        nodeIntegration: true
      }
    })

    timelineWindow.setMenu(null)
    timelineWindow.loadURL(
      url.format({
        pathname: path.join(__dirname, "timeline.html"),
        protocol: "file:",
        slashes: true,
        query: {videoId: args}
      })
    ).then( _ => {}).catch(err => console.log(err))

    if (env.name === "development") {
      timelineWindow.openDevTools();
    }

    windows['timeline'] = timelineWindow

    timelineWindow.on('closed', _ => {
      windows['timeline'] = null
    })
  }
})

//Video conversion
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

//Statistic
ipcMain.on('statistic:video', _ => {
  if(windows['statistic'] === undefined){
    const statisticVideoWindow = createWindow("statisticVideo", {
      width: 1000,
      height: 600,
      webPreferences: {
        nodeIntegration: true
      }
    })
    windows['statisticVideo'] = statisticVideoWindow;
    statisticVideoWindow.setMenu(null)

    statisticVideoWindow.loadURL(
      url.format({
        pathname: path.join(__dirname, "statistic_video.html"),
        protocol: "file:",
        slashes: true
      })
    ).then( _ => {

    }).catch(err => console.log(err))

    windows['statistic'] = statisticVideoWindow

    if (env.name === "development") {
      statisticVideoWindow.openDevTools();
    }

    statisticVideoWindow.on('close', _ =>{
      windows['statistic'] = undefined
    })
  }
})
ipcMain.on("statistic:visualize", (event, args) => {
  const name = `visualize-${args}`
  let visualizeWindow = createWindow("visualizeStatistic", {
    width: 1000,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  })

  visualizeWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, "statistic_visualize.html"),
      protocol: "file",
      slashes: true,
      query: {name: args}
    })
  ).catch(err => {
    console.log(err)
  })

  windows[name] = visualizeWindow

  visualizeWindow.on('close', _ => {
    windows[name] = undefined
  })

  if (env.name === "development") {
    visualizeWindow.openDevTools();
  }
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

  if (env.name === "development") {
    controlWindow.openDevTools();
  }
})

//Logging
ipcMain.on("log:info", ((event, args) => {
  logger.info(args)
}))
ipcMain.on("log:warning", ((event, args) => {
  logger.warning(args)
}))
ipcMain.on("log:error", ((event, args) => {
  logger.error(args)
}))

// Ready state
app.on("ready", () => {
  setApplicationMenu();

  const settings = new Settings()
  settings.init(ipcMain)

  const mainWindow = createWindow("main", {
    width: 1000,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  })
  windows['mainWindow'] = mainWindow;

  mainWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, "app.html"),
      protocol: "file:",
      slashes: true
    })
  ).then( _ => {

  }).catch(err => console.log(err))

  if (env.name === "development") {
    mainWindow.openDevTools();
  }
});

//Closing application
app.on("window-all-closed", () => {
  app.quit();
});

