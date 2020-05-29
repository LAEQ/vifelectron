import "./scss/app.scss"

import { remote, ipcRenderer } from "electron";
import { v4 as uuidv4 } from 'uuid';
import jetpack from "fs-jetpack";
import path from "path"
import ffmpeg from 'fluent-ffmpeg';
import * as genThumbnail from 'simple-thumbnail'
import $ from 'jquery'
import dt from 'datatables'
import 'bootstrap';


import Settings from "./helpers/initialize";
import Repository from "./model/Repository";
import {Video} from "./model/entity/Video";
const app = remote.app;
const ipc = remote.ipcMain
const appDir = jetpack.cwd(app.getAppPath());

const manifest = appDir.read("package.json", "json");

var dest = path.join(__dirname, "/binaries")


let d = dt()
let dialog = remote.dialog
var settings = new Settings()
var repository = new Repository()
var videos, table;

const osMap = {
  win32: "Windows",
  darwin: "macOS",
  linux: "Linux"
};

// var os = require('os')
// var platform = `${os.platform()-os.arch()}`
// var dest = path.join(__dirname, "binaries")
//
// ffbinaries.downloadBinaries(['ffmpeg', 'ffprobe'], {
//   platform: platform, quiet: true, destination: dest}, function(err){
//   console.log('success')
// })


repository.fetchVideos().then(result => {
  videos = result;

  table = $('#table').DataTable({
    "data": videos,
    "columns": [
      // { "data": "id", title: "id" },
      { "data": "name", title: "name"},
      { "data": "duration", title: "duration"},
      { "data": "collection.name", title: "collection"},
      { "data": "total", title: "total"},
      { "data": null}
    ],
    "columnDefs": [
      {"targets": -1, "data": null, "defaultContent": "<button class='btn btn-sm btn-outline-primary'>Edit</button>"}
    ]
  });

  $('#table tbody').on( 'click', 'button', function () {
    var data = table.row( $(this).parents('tr') ).data();

    ipcRenderer.send("editor:open", data.id)
  });
})

document.getElementById("add").addEventListener("click", _ => {
    dialog.showOpenDialog({properties: ['openFile'], filters: [{name: "Movies", extensions: ['mkv', 'avi', 'mp4']}]}).then(file =>{
      document.getElementById("message-box").innerHTML = file
      if(file && file.filePaths && file.filePaths.length > 0){
        const filePath = file.filePaths[0]
        const id = uuidv4()
        const obj = {
          id: id,
          name: path.basename(path.basename(filePath)),
          path: filePath,
          duration: 0,
          collection: repository.defaultCollection(),
          total: 0
        }

        const video = new Video(obj)
        videos.push(video)


        //Create point file
        const pointFile = path.join(settings.video, `${id}.json`)
        jetpack.fileAsync(pointFile, {content: '[]'}).then(_ => console.log("video added")).catch(err => console.log(err))

        ffmpeg.setFfmpegPath(settings.getFfmpegPath())
        ffmpeg.setFfprobePath(settings.getFfprobePath())
        ffmpeg.ffprobe(filePath, (err, metadata) =>{
          if(err === null){
            video.duration = metadata.format.duration
          } else {
            console.log(err)
          }
        })

        ffmpeg(filePath)
          .screenshots({
            timestamps: [0],
            filename: `${id}.png`,
            folder: settings.video,
            size: '320x?'
          });

        repository.save(videos, "video.json")
        var t = $('#table').DataTable();
        t.row.add(video).draw(false)

      } else {
        document.getElementById("message-box").innerHTML = "no file"
      }
    }).catch((err) => {
        document.getElementById("message-box").innerHTML = err
    })
 })

ipc.on("video:update", (event, args) => {
  if(table){
    console.log(args)
    table.rows().data().clear()
    table.draw()
  }
});
