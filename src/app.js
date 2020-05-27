import "./scss/app.scss"


import { remote } from "electron";
import jetpack from "fs-jetpack";
import $ from 'jquery'
import dt from 'datatables'
import Repository from "./model/Repository";
const app = remote.app;
const appDir = jetpack.cwd(app.getAppPath());

// Holy crap! This is browser window with HTML and stuff, but I can read
// files from disk like it's node.js! Welcome to Electron world :)
const manifest = appDir.read("package.json", "json");

const osMap = {
  win32: "Windows",
  darwin: "macOS",
  linux: "Linux"
};

let d = dt()

var videos = new Repository().fetchVideo()

$('#table').DataTable({
  "data": videos,
  "columns": [
    { "data": "id", title: "id" },
    { "data": "name", title: "name"},
    { "data": "collection.name", title: "collection"},
    { "data": "total", title: "total"},
    { "data": "createdAt", title: "created at"},
    { "data": "last", title: "last"},
    { "data": null}
  ],
  "columnDefs": [
    {"targets": -1, "data": null, "defaultContent": "<button class='btn btn-sm btn-outline-primary'>Edit</button>"}
  ]
});


