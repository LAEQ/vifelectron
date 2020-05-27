/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/background.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./config/env_development.json":
/*!*************************************!*\
  !*** ./config/env_development.json ***!
  \*************************************/
/*! exports provided: name, description, default */
/***/ (function(module) {

module.exports = JSON.parse("{\"name\":\"development\",\"description\":\"Add here any environment specific stuff you like.\"}");

/***/ }),

/***/ "./src/background.js":
/*!***************************!*\
  !*** ./src/background.js ***!
  \***************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! path */ "path");
/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(path__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var url__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! url */ "url");
/* harmony import */ var url__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(url__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var electron__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! electron */ "electron");
/* harmony import */ var electron__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(electron__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _menu_dev_menu_template__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./menu/dev_menu_template */ "./src/menu/dev_menu_template.js");
/* harmony import */ var _menu_edit_menu_template__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./menu/edit_menu_template */ "./src/menu/edit_menu_template.js");
/* harmony import */ var _menu_video_menu_template__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./menu/video_menu_template */ "./src/menu/video_menu_template.js");
/* harmony import */ var _helpers_window__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./helpers/window */ "./src/helpers/window.js");
/* harmony import */ var env__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! env */ "./config/env_development.json");
var env__WEBPACK_IMPORTED_MODULE_7___namespace = /*#__PURE__*/__webpack_require__.t(/*! env */ "./config/env_development.json", 1);
/* harmony import */ var _helpers_initialize__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./helpers/initialize */ "./src/helpers/initialize.js");
// This is main process of Electron, started as first thing when your
// app starts. It runs through entire life of your application.
// It doesn't have any windows which you can see on screen, but we can open
// window from here.








__webpack_require__(/*! electron-reload */ "electron-reload")(__dirname, {
  electron: path__WEBPACK_IMPORTED_MODULE_0___default.a.join(__dirname, 'nodes_modules', '.bin', 'electron')
}); // Special module holding environment variables which you declared
// in config/env_xxx.json file.




let setting = new _helpers_initialize__WEBPACK_IMPORTED_MODULE_8__["default"]();
const src = path__WEBPACK_IMPORTED_MODULE_0___default.a.join(setting.video, "test.mp4");
const dst = path__WEBPACK_IMPORTED_MODULE_0___default.a.join(setting.video, "test_dest.mp4");

const setApplicationMenu = () => {
  const menus = [_menu_video_menu_template__WEBPACK_IMPORTED_MODULE_5__["videoMenuTemplate"], _menu_edit_menu_template__WEBPACK_IMPORTED_MODULE_4__["editMenuTemplate"]];

  if (env__WEBPACK_IMPORTED_MODULE_7__.name !== "production") {
    menus.push(_menu_dev_menu_template__WEBPACK_IMPORTED_MODULE_3__["devMenuTemplate"]);
  }

  electron__WEBPACK_IMPORTED_MODULE_2__["Menu"].setApplicationMenu(electron__WEBPACK_IMPORTED_MODULE_2__["Menu"].buildFromTemplate(menus));
}; // Save userData in separate folders for each environment.
// Thanks to this you can use production and development versions of the app
// on same machine like those are two separate apps.


if (env__WEBPACK_IMPORTED_MODULE_7__.name !== "production") {
  const userDataPath = electron__WEBPACK_IMPORTED_MODULE_2__["app"].getPath("userData");
  electron__WEBPACK_IMPORTED_MODULE_2__["app"].setPath("userData", `${userDataPath} (${env__WEBPACK_IMPORTED_MODULE_7__.name})`);
}

const ipcMain = __webpack_require__(/*! electron */ "electron").ipcMain;

ipcMain.on('category:open', _ => {
  let categoryWindow = Object(_helpers_window__WEBPACK_IMPORTED_MODULE_6__["default"])("category", {
    width: 1000,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  });
  categoryWindow.setMenu(null);
  categoryWindow.webContents.openDevTools();
  categoryWindow.loadURL(url__WEBPACK_IMPORTED_MODULE_1___default.a.format({
    pathname: path__WEBPACK_IMPORTED_MODULE_0___default.a.join(__dirname, "category.html"),
    protocol: "file",
    slashes: true
  })).then(_ => {});
});
ipcMain.on('editor:open', _ => {
  let editorWindow = Object(_helpers_window__WEBPACK_IMPORTED_MODULE_6__["default"])("editor", {
    width: 1000,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  });
  let controlWindow = Object(_helpers_window__WEBPACK_IMPORTED_MODULE_6__["default"])("controls", {
    width: 150,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  });
  controlWindow.setMenu(null);
  controlWindow.loadURL(url__WEBPACK_IMPORTED_MODULE_1___default.a.format({
    pathname: path__WEBPACK_IMPORTED_MODULE_0___default.a.join(__dirname, "controls.html"),
    protocol: "file",
    slashes: true
  }));
  editorWindow.setMenu(null);
  editorWindow.webContents.openDevTools();
  editorWindow.loadURL(url__WEBPACK_IMPORTED_MODULE_1___default.a.format({
    pathname: path__WEBPACK_IMPORTED_MODULE_0___default.a.join(__dirname, "editor.html"),
    protocol: "file",
    slashes: true
  })).then(_ => {
    editorWindow.webContents.send("video:metadata", "test");
  });
});
ipcMain.on('category:create', (event, category) => {
  console.log(category);
});
electron__WEBPACK_IMPORTED_MODULE_2__["app"].on("ready", () => {
  setApplicationMenu();
  const settings = new _helpers_initialize__WEBPACK_IMPORTED_MODULE_8__["default"]();
  settings.init();
  const mainWindow = Object(_helpers_window__WEBPACK_IMPORTED_MODULE_6__["default"])("main", {
    width: 1000,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  });
  mainWindow.loadURL(url__WEBPACK_IMPORTED_MODULE_1___default.a.format({
    pathname: path__WEBPACK_IMPORTED_MODULE_0___default.a.join(__dirname, "app.html"),
    protocol: "file:",
    slashes: true
  })).then(_ => {});

  if (env__WEBPACK_IMPORTED_MODULE_7__.name === "development") {
    mainWindow.openDevTools();
  }
});
electron__WEBPACK_IMPORTED_MODULE_2__["app"].on("window-all-closed", () => {
  electron__WEBPACK_IMPORTED_MODULE_2__["app"].quit();
});

/***/ }),

/***/ "./src/helpers/initialize.js":
/*!***********************************!*\
  !*** ./src/helpers/initialize.js ***!
  \***********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! path */ "path");
/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(path__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var fs_jetpack__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! fs-jetpack */ "fs-jetpack");
/* harmony import */ var fs_jetpack__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(fs_jetpack__WEBPACK_IMPORTED_MODULE_1__);



class Settings {
  constructor() {
    this.homeDir = path__WEBPACK_IMPORTED_MODULE_0___default.a.join(__webpack_require__(/*! os */ "os").homedir(), "vifeco");
    this.db = path__WEBPACK_IMPORTED_MODULE_0___default.a.join(this.homeDir, "db");
    this.icon = path__WEBPACK_IMPORTED_MODULE_0___default.a.join(this.homeDir, "icons");
    this.video = path__WEBPACK_IMPORTED_MODULE_0___default.a.join(this.homeDir, "video");
  }

  getCategoryPath() {
    return path__WEBPACK_IMPORTED_MODULE_0___default.a.join(this.db, "category.json");
  }

  init() {
    const dirs = [this.homeDir, this.db, this.icon, this.video];
    dirs.forEach(d => fs_jetpack__WEBPACK_IMPORTED_MODULE_1___default.a.dir(d)); //Add default categories / collection

    fs_jetpack__WEBPACK_IMPORTED_MODULE_1___default.a.findAsync(path__WEBPACK_IMPORTED_MODULE_0___default.a.join(fs_jetpack__WEBPACK_IMPORTED_MODULE_1___default.a.cwd(), "resources", "fixtures"), {
      matching: "*.json"
    }).then(r => {
      r.forEach(d => {
        const filename = path__WEBPACK_IMPORTED_MODULE_0___default.a.basename(d);
        const dest = path__WEBPACK_IMPORTED_MODULE_0___default.a.join(this.db, filename);

        if (fs_jetpack__WEBPACK_IMPORTED_MODULE_1___default.a.exists(dest) === false) {
          fs_jetpack__WEBPACK_IMPORTED_MODULE_1___default.a.copyAsync(d, dest);
        }
      });
    }); //Add default icons

    fs_jetpack__WEBPACK_IMPORTED_MODULE_1___default.a.findAsync(path__WEBPACK_IMPORTED_MODULE_0___default.a.join(fs_jetpack__WEBPACK_IMPORTED_MODULE_1___default.a.cwd(), "resources", "icons"), {
      matching: "*.svg"
    }).then(r => {
      r.forEach(f => {
        const filename = path__WEBPACK_IMPORTED_MODULE_0___default.a.basename(f);
        const dest = path__WEBPACK_IMPORTED_MODULE_0___default.a.join(this.icon, filename);

        if (fs_jetpack__WEBPACK_IMPORTED_MODULE_1___default.a.exists(dest) === false) {
          fs_jetpack__WEBPACK_IMPORTED_MODULE_1___default.a.copyAsync(f, dest);
        }
      });
    });
  }

}

/* harmony default export */ __webpack_exports__["default"] = (Settings);

/***/ }),

/***/ "./src/helpers/window.js":
/*!*******************************!*\
  !*** ./src/helpers/window.js ***!
  \*******************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var electron__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! electron */ "electron");
/* harmony import */ var electron__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(electron__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var fs_jetpack__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! fs-jetpack */ "fs-jetpack");
/* harmony import */ var fs_jetpack__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(fs_jetpack__WEBPACK_IMPORTED_MODULE_1__);
// This helper remembers the size and position of your windows (and restores
// them in that place after app relaunch).
// Can be used for more than one window, just construct many
// instances of it and give each different name.


/* harmony default export */ __webpack_exports__["default"] = ((name, options) => {
  const userDataDir = fs_jetpack__WEBPACK_IMPORTED_MODULE_1___default.a.cwd(electron__WEBPACK_IMPORTED_MODULE_0__["app"].getPath("userData"));
  const stateStoreFile = `window-state-${name}.json`;
  const defaultSize = {
    width: options.width,
    height: options.height
  };
  let state = {};
  let win;

  const restore = () => {
    let restoredState = {};

    try {
      restoredState = userDataDir.read(stateStoreFile, "json");
    } catch (err) {// For some reason json can't be read (might be corrupted).
      // No worries, we have defaults.
    }

    return Object.assign({}, defaultSize, restoredState);
  };

  const getCurrentPosition = () => {
    const position = win.getPosition();
    const size = win.getSize();
    return {
      x: position[0],
      y: position[1],
      width: size[0],
      height: size[1]
    };
  };

  const windowWithinBounds = (windowState, bounds) => {
    return windowState.x >= bounds.x && windowState.y >= bounds.y && windowState.x + windowState.width <= bounds.x + bounds.width && windowState.y + windowState.height <= bounds.y + bounds.height;
  };

  const resetToDefaults = () => {
    const bounds = electron__WEBPACK_IMPORTED_MODULE_0__["screen"].getPrimaryDisplay().bounds;
    return Object.assign({}, defaultSize, {
      x: (bounds.width - defaultSize.width) / 2,
      y: (bounds.height - defaultSize.height) / 2
    });
  };

  const ensureVisibleOnSomeDisplay = windowState => {
    const visible = electron__WEBPACK_IMPORTED_MODULE_0__["screen"].getAllDisplays().some(display => {
      return windowWithinBounds(windowState, display.bounds);
    });

    if (!visible) {
      // Window is partially or fully not visible now.
      // Reset it to safe defaults.
      return resetToDefaults();
    }

    return windowState;
  };

  const saveState = () => {
    if (!win.isMinimized() && !win.isMaximized()) {
      Object.assign(state, getCurrentPosition());
    }

    userDataDir.write(stateStoreFile, state, {
      atomic: true
    });
  };

  state = ensureVisibleOnSomeDisplay(restore());
  win = new electron__WEBPACK_IMPORTED_MODULE_0__["BrowserWindow"](Object.assign({}, options, state));
  win.on("close", saveState);
  return win;
});

/***/ }),

/***/ "./src/menu/dev_menu_template.js":
/*!***************************************!*\
  !*** ./src/menu/dev_menu_template.js ***!
  \***************************************/
/*! exports provided: devMenuTemplate */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "devMenuTemplate", function() { return devMenuTemplate; });
/* harmony import */ var electron__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! electron */ "electron");
/* harmony import */ var electron__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(electron__WEBPACK_IMPORTED_MODULE_0__);

const devMenuTemplate = {
  label: "Development",
  submenu: [{
    label: "Reload",
    accelerator: "CmdOrCtrl+R",
    click: () => {
      electron__WEBPACK_IMPORTED_MODULE_0__["BrowserWindow"].getFocusedWindow().webContents.reloadIgnoringCache();
    }
  }, {
    label: "Toggle DevTools",
    accelerator: "Alt+CmdOrCtrl+I",
    click: () => {
      electron__WEBPACK_IMPORTED_MODULE_0__["BrowserWindow"].getFocusedWindow().toggleDevTools();
    }
  }, {
    label: "Quit",
    accelerator: "CmdOrCtrl+Q",
    click: () => {
      electron__WEBPACK_IMPORTED_MODULE_0__["app"].quit();
    }
  }]
};

/***/ }),

/***/ "./src/menu/edit_menu_template.js":
/*!****************************************!*\
  !*** ./src/menu/edit_menu_template.js ***!
  \****************************************/
/*! exports provided: editMenuTemplate */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "editMenuTemplate", function() { return editMenuTemplate; });
const editMenuTemplate = {
  label: "Edit",
  submenu: [{
    label: "Undo",
    accelerator: "CmdOrCtrl+Z",
    selector: "undo:"
  }, {
    label: "Redo",
    accelerator: "Shift+CmdOrCtrl+Z",
    selector: "redo:"
  }, {
    type: "separator"
  }, {
    label: "Cut",
    accelerator: "CmdOrCtrl+X",
    selector: "cut:"
  }, {
    label: "Copy",
    accelerator: "CmdOrCtrl+C",
    selector: "copy:"
  }, {
    label: "Paste",
    accelerator: "CmdOrCtrl+V",
    selector: "paste:"
  }, {
    label: "Select All",
    accelerator: "CmdOrCtrl+A",
    selector: "selectAll:"
  }]
};

/***/ }),

/***/ "./src/menu/video_menu_template.js":
/*!*****************************************!*\
  !*** ./src/menu/video_menu_template.js ***!
  \*****************************************/
/*! exports provided: videoMenuTemplate */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "videoMenuTemplate", function() { return videoMenuTemplate; });
/* harmony import */ var electron__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! electron */ "electron");
/* harmony import */ var electron__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(electron__WEBPACK_IMPORTED_MODULE_0__);

const videoMenuTemplate = {
  label: "Feature",
  submenu: [{
    label: "Video editor",
    accelerator: "CmdOrCtrl+V",

    click() {
      electron__WEBPACK_IMPORTED_MODULE_0___default.a.ipcMain.emit('editor:open');
    }

  }, {
    label: "Category",
    accelerator: "CmdOrCtrl+C",

    click() {
      electron__WEBPACK_IMPORTED_MODULE_0___default.a.ipcMain.emit('category:open');
    }

  }, {
    label: "Collection",
    accelerator: "CmdOrCtrl+V",

    click() {
      electron__WEBPACK_IMPORTED_MODULE_0___default.a.ipcMain.emit('collection:open');
    }

  }]
};


/***/ }),

/***/ "electron":
/*!***************************!*\
  !*** external "electron" ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("electron");

/***/ }),

/***/ "electron-reload":
/*!**********************************!*\
  !*** external "electron-reload" ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("electron-reload");

/***/ }),

/***/ "fs-jetpack":
/*!*****************************!*\
  !*** external "fs-jetpack" ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("fs-jetpack");

/***/ }),

/***/ "os":
/*!*********************!*\
  !*** external "os" ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("os");

/***/ }),

/***/ "path":
/*!***********************!*\
  !*** external "path" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("path");

/***/ }),

/***/ "url":
/*!**********************!*\
  !*** external "url" ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("url");

/***/ })

/******/ });
//# sourceMappingURL=background.js.map