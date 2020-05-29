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
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/editor.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/editor.js":
/*!***********************!*\
  !*** ./src/editor.js ***!
  \***********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var electron__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! electron */ "electron");
/* harmony import */ var electron__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(electron__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var fs_jetpack__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! fs-jetpack */ "fs-jetpack");
/* harmony import */ var fs_jetpack__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(fs_jetpack__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! path */ "path");
/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(path__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _helpers_initialize__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./helpers/initialize */ "./src/helpers/initialize.js");
/* harmony import */ var _model_Repository__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./model/Repository */ "./src/model/Repository.js");
/* harmony import */ var _model_entity_Point__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./model/entity/Point */ "./src/model/entity/Point.js");






const app = electron__WEBPACK_IMPORTED_MODULE_0__["remote"].app;
const ipc = electron__WEBPACK_IMPORTED_MODULE_0__["remote"].ipcMain;
const appDir = fs_jetpack__WEBPACK_IMPORTED_MODULE_1___default.a.cwd(app.getAppPath());
const settings = new _helpers_initialize__WEBPACK_IMPORTED_MODULE_3__["default"]();
const repository = new _model_Repository__WEBPACK_IMPORTED_MODULE_4__["default"]();
const manifest = appDir.read("package.json", "json");
var player = document.querySelector("video");
var catContainer = document.getElementById('icons');
const videoId = global.location.search.split("=")[1];
const video = repository.fetchVideo(videoId);
var points = [];
repository.fetchPoints(videoId).then(r => {
  points = r;
  player.src = video.path;
});

player.oncanplay = _ => {
  player.play();
};

player.addEventListener("playing", _ => {
  timerFetch();
});
var fetchTimer;
var saveTimer;

function fetchPoint() {
  // console.log("Total points: " + points.length)
  document.getElementById("total").innerHTML = "Total points: " + points.length;
}

function timerFetch() {
  fetchPoint();
  fetchTimer = setTimeout(timerFetch, 1000);
}

function timerSaveVideo() {}

document.getElementById("title").innerHTML = video.name;
repository.fetchCategory().then(categories => {
  let image = "";
  categories.forEach(c => {
    let filePath = path__WEBPACK_IMPORTED_MODULE_2___default.a.join(settings.icon, c.path);
    image += `<li class="list-group-item"><img src="${filePath}" id="${c.name}" class="" /></li>`;
  });
  catContainer.innerHTML = image;
}); //Controls

document.getElementById("play").addEventListener("click", _ => {
  player.play();
});
document.getElementById("stop").addEventListener("click", _ => {
  player.pause();

  if (fetchTimer) {
    clearTimeout(fetchTimer);
  }
});
var mousePosition;
player.addEventListener('mouseout', _ => {
  mousePosition = undefined;
});
player.addEventListener('mousemove', ev => {
  mousePosition = ev;
});
document.addEventListener('keydown', ev => {
  if (mousePosition) {
    const values = {
      videoId: videoId,
      categoryId: 1,
      x: mousePosition.layerX,
      y: mousePosition.layerY,
      currentTime: player.currentTime
    };
    let point = new _model_entity_Point__WEBPACK_IMPORTED_MODULE_5__["Point"](values);
    points.push(point);
    video.total = points.length;
    electron__WEBPACK_IMPORTED_MODULE_0__["ipcRenderer"].send('point:add', point);
  }
});
ipc.on("point:add", (event, args) => {
  repository.savePoints(points, videoId);
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
/* harmony import */ var ffbinaries__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ffbinaries */ "ffbinaries");
/* harmony import */ var ffbinaries__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(ffbinaries__WEBPACK_IMPORTED_MODULE_2__);




var os = __webpack_require__(/*! os */ "os");

var platform = `${os.platform() - os.arch()}`;
var dest = path__WEBPACK_IMPORTED_MODULE_0___default.a.join(__dirname, "binaries");

class Settings {
  constructor() {
    this.homeDir = path__WEBPACK_IMPORTED_MODULE_0___default.a.join(__webpack_require__(/*! os */ "os").homedir(), "vifeco");
    this.db = path__WEBPACK_IMPORTED_MODULE_0___default.a.join(this.homeDir, "db");
    this.icon = path__WEBPACK_IMPORTED_MODULE_0___default.a.join(this.homeDir, "icons");
    this.video = path__WEBPACK_IMPORTED_MODULE_0___default.a.join(this.homeDir, "video");
    this.binaries = path__WEBPACK_IMPORTED_MODULE_0___default.a.join(this.homeDir, "binaries");
  }

  getCategoryPath() {
    return path__WEBPACK_IMPORTED_MODULE_0___default.a.join(this.db, "category.json");
  }

  getCollectionPath() {
    return path__WEBPACK_IMPORTED_MODULE_0___default.a.join(this.db, "collection.json");
  }

  getVideoPath() {
    return path__WEBPACK_IMPORTED_MODULE_0___default.a.join(this.db, "video.json");
  }

  getFfmpegPath() {
    return path__WEBPACK_IMPORTED_MODULE_0___default.a.join(this.binaries, "ffmpeg");
  }

  getFfprobePath() {
    return path__WEBPACK_IMPORTED_MODULE_0___default.a.join(this.binaries, 'ffprobe');
  }

  init() {
    const dirs = [this.homeDir, this.db, this.icon, this.video, this.binaries];
    dirs.forEach(d => fs_jetpack__WEBPACK_IMPORTED_MODULE_1___default.a.dir(d)); //Add default categories / collection

    fs_jetpack__WEBPACK_IMPORTED_MODULE_1___default.a.findAsync(path__WEBPACK_IMPORTED_MODULE_0___default.a.join(__dirname, "resources", "json"), {
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

    fs_jetpack__WEBPACK_IMPORTED_MODULE_1___default.a.findAsync(path__WEBPACK_IMPORTED_MODULE_0___default.a.join(__dirname, "resources", "icons"), {
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

    if (fs_jetpack__WEBPACK_IMPORTED_MODULE_1___default.a.exists(this.getFfmpegPath()) === false) {
      ffbinaries__WEBPACK_IMPORTED_MODULE_2__["downloadBinaries"](['ffmpeg', 'ffprobe'], {
        platform: platform,
        quiet: true,
        destination: this.binaries
      }, function (err) {
        console.log('success');
      });
    }
  }

}

/* harmony default export */ __webpack_exports__["default"] = (Settings);

/***/ }),

/***/ "./src/model/Repository.js":
/*!*********************************!*\
  !*** ./src/model/Repository.js ***!
  \*********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _helpers_initialize__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../helpers/initialize */ "./src/helpers/initialize.js");
/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! path */ "path");
/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(path__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var uuid__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! uuid */ "uuid");
/* harmony import */ var uuid__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(uuid__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var fs_jetpack__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! fs-jetpack */ "fs-jetpack");
/* harmony import */ var fs_jetpack__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(fs_jetpack__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _entity_Category__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./entity/Category */ "./src/model/entity/Category.js");
/* harmony import */ var _entity_Collection__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./entity/Collection */ "./src/model/entity/Collection.js");
/* harmony import */ var _entity_Video__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./entity/Video */ "./src/model/entity/Video.js");
/* harmony import */ var _entity_Point__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./entity/Point */ "./src/model/entity/Point.js");









class Repository {
  constructor() {
    this.settings = new _helpers_initialize__WEBPACK_IMPORTED_MODULE_0__["default"]();
  }

  async fetchCategory() {
    const file = this.settings.getCategoryPath();
    let result = [];

    if (fs_jetpack__WEBPACK_IMPORTED_MODULE_3___default.a.exists(file)) {
      await fs_jetpack__WEBPACK_IMPORTED_MODULE_3___default.a.readAsync(file, "json").then(r => {
        result = r.map(category => {
          return new _entity_Category__WEBPACK_IMPORTED_MODULE_4__["Category"](category);
        });
      });
      return result;
    } else {
      return result;
    }
  }

  async fetchVideos() {
    const file = this.settings.getVideoPath();
    let result = [];

    if (fs_jetpack__WEBPACK_IMPORTED_MODULE_3___default.a.exists(file)) {
      await fs_jetpack__WEBPACK_IMPORTED_MODULE_3___default.a.readAsync(file, "json").then(r => {
        result = r.map(video => {
          return new _entity_Video__WEBPACK_IMPORTED_MODULE_6__["Video"](video);
        });
      });
      return result;
    } else {
      return result;
    }
  }

  fetchVideo(id) {
    return fs_jetpack__WEBPACK_IMPORTED_MODULE_3___default.a.read(this.settings.getVideoPath(), "json").filter(obj => obj.id === id).map(v => new _entity_Video__WEBPACK_IMPORTED_MODULE_6__["Video"](v))[0];
  }

  async fetchPoints(videoId) {
    let result = [];
    const points = fs_jetpack__WEBPACK_IMPORTED_MODULE_3___default.a.read(path__WEBPACK_IMPORTED_MODULE_1___default.a.join(this.settings.video, `${videoId}.json`), "json");
    return points.map(obj => {
      return new _entity_Point__WEBPACK_IMPORTED_MODULE_7__["Point"](obj);
    });
  }

  defaultCollection() {
    const collections = fs_jetpack__WEBPACK_IMPORTED_MODULE_3___default.a.read(this.settings.getCollectionPath(), "json");
    return collections.filter(c => c.default).map(c => new _entity_Collection__WEBPACK_IMPORTED_MODULE_5__["Collection"](c))[0];
  }

  createCategory(data) {
    //Move file
    const filename = path__WEBPACK_IMPORTED_MODULE_1___default.a.basename(data.get('file').path);
    console.log(data.get('file'));
    const uuid = Object(uuid__WEBPACK_IMPORTED_MODULE_2__["v4"])();
    fs_jetpack__WEBPACK_IMPORTED_MODULE_3___default.a.copy(data.get('file').path, path__WEBPACK_IMPORTED_MODULE_1___default.a.join(this.settings.icon, filename));
    const values = {
      id: uuid,
      name: data.get('name'),
      path: filename,
      shortcut: 'Z'
    };
    const category = new _entity_Category__WEBPACK_IMPORTED_MODULE_4__["Category"](values);
    return category;
  }

  save(obj, filename) {
    fs_jetpack__WEBPACK_IMPORTED_MODULE_3___default.a.write(path__WEBPACK_IMPORTED_MODULE_1___default.a.join(this.settings.db, filename), obj);
  }

  savePoints(points, videoId) {
    fs_jetpack__WEBPACK_IMPORTED_MODULE_3___default.a.write(path__WEBPACK_IMPORTED_MODULE_1___default.a.join(this.settings.video, `${videoId}.json`), points);
  }

}

/* harmony default export */ __webpack_exports__["default"] = (Repository);

/***/ }),

/***/ "./src/model/entity/Category.js":
/*!**************************************!*\
  !*** ./src/model/entity/Category.js ***!
  \**************************************/
/*! exports provided: Category */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Category", function() { return Category; });
class Category {
  constructor(obj) {
    this.id = obj.id;
    this.name = obj.name;
    this.path = obj.path;
    this.shortcut = obj.shortcut;
  }

}

class Collection {
  constructor() {}

}



/***/ }),

/***/ "./src/model/entity/Collection.js":
/*!****************************************!*\
  !*** ./src/model/entity/Collection.js ***!
  \****************************************/
/*! exports provided: Collection */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Collection", function() { return Collection; });
class Collection {
  constructor(obj) {
    this.id = obj.id;
    this.name = obj.name;
    this.categories = obj.categories;
    this.default = obj.default;
  }

}

/***/ }),

/***/ "./src/model/entity/Point.js":
/*!***********************************!*\
  !*** ./src/model/entity/Point.js ***!
  \***********************************/
/*! exports provided: Point */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Point", function() { return Point; });
class Point {
  constructor(obj) {
    this.videoId = obj.videoId;
    this.categoryId = obj.categoryId;
    this.x = obj.x;
    this.y = obj.y;
    this.currentTime = obj.currentTime;
  }

}

/***/ }),

/***/ "./src/model/entity/Video.js":
/*!***********************************!*\
  !*** ./src/model/entity/Video.js ***!
  \***********************************/
/*! exports provided: Video */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Video", function() { return Video; });
/* harmony import */ var _Collection__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Collection */ "./src/model/entity/Collection.js");
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! moment */ "moment");
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(moment__WEBPACK_IMPORTED_MODULE_1__);


class Video {
  constructor(obj) {
    this.id = obj.id;
    this.name = obj.name;
    this.path = obj.path;
    this.duration = obj.duration;
    this.collection = new _Collection__WEBPACK_IMPORTED_MODULE_0__["Collection"](obj.collection);
    this.total = obj.total;
  }

}

/***/ }),

/***/ "electron":
/*!***************************!*\
  !*** external "electron" ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("electron");

/***/ }),

/***/ "ffbinaries":
/*!*****************************!*\
  !*** external "ffbinaries" ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("ffbinaries");

/***/ }),

/***/ "fs-jetpack":
/*!*****************************!*\
  !*** external "fs-jetpack" ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("fs-jetpack");

/***/ }),

/***/ "moment":
/*!*************************!*\
  !*** external "moment" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("moment");

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

/***/ "uuid":
/*!***********************!*\
  !*** external "uuid" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("uuid");

/***/ })

/******/ });
//# sourceMappingURL=editor.js.map