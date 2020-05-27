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
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/category.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/category.js":
/*!*************************!*\
  !*** ./src/category.js ***!
  \*************************/
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
/* harmony import */ var _model_Repository__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./model/Repository */ "./src/model/Repository.js");
/* harmony import */ var _helpers_initialize__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./helpers/initialize */ "./src/helpers/initialize.js");





const app = electron__WEBPACK_IMPORTED_MODULE_0__["remote"].app;
const appDir = fs_jetpack__WEBPACK_IMPORTED_MODULE_1___default.a.cwd(app.getAppPath());
const settings = new _helpers_initialize__WEBPACK_IMPORTED_MODULE_4__["default"](); // Holy crap! This is browser window with HTML and stuff, but I can read
// files from disk like it's node.js! Welcome to Electron world :)

const manifest = appDir.read("package.json", "json");
const osMap = {
  win32: "Windows",
  darwin: "macOS",
  linux: "Linux"
};

const getFile = _ => {
  const file = document.getElementById('file').files[0];
  return file;
};

document.getElementById("speed").addEventListener('change', ev => {});
document.getElementById('file').addEventListener('change', ev => {
  const file = getFile();

  if (file) {
    document.getElementById('preview').src = file.path;
  }
});
document.querySelector("form").addEventListener("submit", _ => {
  event.preventDefault();
  const file = getFile();

  if (file) {
    electron__WEBPACK_IMPORTED_MODULE_0__["ipcRenderer"].send("category:create", {
      name: "test",
      path: file.path,
      color: "black",
      shortcut: "C"
    });
  }
});
const repository = new _model_Repository__WEBPACK_IMPORTED_MODULE_3__["default"]();
repository.fetchCategory().then(categories => {
  let html = "";
  categories.forEach(c => {
    console.log(c);
    html += `<div class="card mb-4 shadow-sm">
      <div class="card-header">
        <h4 class="my-0 font-weight-normal">${c.name}</h4>
      </div>
      <div class="card-body">
        <img src="${path__WEBPACK_IMPORTED_MODULE_2___default.a.join(settings.icon, c.path)}" width="100", height="100" />
      </div>
    </div>`;
  });
  document.getElementById("category-container").innerHTML = html;
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

/***/ "./src/model/Repository.js":
/*!*********************************!*\
  !*** ./src/model/Repository.js ***!
  \*********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _helpers_initialize__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../helpers/initialize */ "./src/helpers/initialize.js");
/* harmony import */ var fs_jetpack__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! fs-jetpack */ "fs-jetpack");
/* harmony import */ var fs_jetpack__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(fs_jetpack__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _entity_Category__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./entity/Category */ "./src/model/entity/Category.js");




class Repository {
  constructor() {
    this.settings = new _helpers_initialize__WEBPACK_IMPORTED_MODULE_0__["default"]();
  }

  async fetchCategory() {
    const file = this.settings.getCategoryPath();
    let result = [];

    if (fs_jetpack__WEBPACK_IMPORTED_MODULE_1___default.a.exists(file)) {
      await fs_jetpack__WEBPACK_IMPORTED_MODULE_1___default.a.readAsync(file, "json").then(r => {
        result = r.map(category => {
          return new _entity_Category__WEBPACK_IMPORTED_MODULE_2__["Category"](category);
        });
      });
      return result;
    } else {
      return result;
    }
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

/***/ "electron":
/*!***************************!*\
  !*** external "electron" ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("electron");

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

/***/ })

/******/ });
//# sourceMappingURL=category.js.map