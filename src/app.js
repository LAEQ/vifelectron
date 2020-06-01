import "./scss/app.scss"

import { remote, ipcRenderer } from "electron";
import { v4 as uuidv4 } from 'uuid';
import jetpack from "fs-jetpack";
import path from "path"
import ffmpeg from 'fluent-ffmpeg';
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


let d = dt()
let dialog = remote.dialog
var settings = new Settings()
var repository = new Repository()
var videos, table;

var latestVideo

repository.fetchVideos().then(result => {
  videos = result;

  showLastVideo(result)


  // showLastVideo(result[0])

  table = $('#table').DataTable({
    "data": videos,
    "columns": [
      { "data": "id", title: "#" },
      { "data": "name", title: "name"},
      { "data": "duration", title: "duration"},
      { "data": "collection.name", title: "collection"},
      { "data": "total", title: "total"},
      { "data": null}
    ],
    "columnDefs": [
      {targets: 0, render: function(id) {
          const src = path.join(settings.video, id)
          return `<img src="${src}.png" width="130" />`
        }},
      {"targets": -1, "data": null, "defaultContent": "<button class='btn btn-sm btn-outline-primary'>Edit</button>"}
    ]
  });

  $('#table tbody').on( 'click', 'button', function () {
    var data = table.row( $(this).parents('tr') ).data();

    ipcRenderer.send("editor:open", data.id)
  });
})

const showLastVideo = (videos) => {
  let html = `<div class="col-12">No video</div>`
  if(videos && videos.length > 0){
    const video = videos[videos.length - 1]
    const filePath = path.join(settings.video, `${video.id}.png`)
    html = `<div class="col-md-4">
                <img src="${filePath}" alt="image" class="img-thumbnail" >
              </div>
              <div class="col-md-8">
                <dl class="row" id="video-detail-dl">
                      <dt class="col-sm-3">Name</dt>
                      <dd class="col-sm-9">${video.name}</dd>
                      <dt class="col-sm-3">Path</dt>
                      <dd class="col-sm-9">${video.path}</dd>
                      <dt class="col-sm-3">Duration</dt>
                      <dd class="col-sm-9">${video.duration}</dd>
                      <dt class="col-sm-3">Collection</dt>
                      <dd class="col-sm-9">${video.collection.name}</dd>
                      <dt class="col-sm-3">Total count</dt>
                      <dd class="col-sm-9">${video.total}</dd>
                      <dt class="col-sm-3">Latest count</dt>
                      <dd class="col-sm-9">${video.last}</dd>
                </dl>
                <div class=""><button class="btn btn-outline-success btn-lg">Start</button> </div>
              </div>`

  }

  document.getElementById('latest-video-section').innerHTML = html
}

document.getElementById("add").addEventListener("click", _ => {
    dialog.showOpenDialog({properties: ['openFile'], filters: [{name: "Movies", extensions: ['mkv', 'avi', 'mp4']}]}).then(file =>{
      // document.getElementById("message-box").innerHTML = file
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
            size: '520x?'
          }).on('end', _ => {
            repository.save(videos, "video.json")
            var t = $('#table').DataTable();
            t.row.add(video).draw(false)
            showLastVideo(videos)
        })

      } else {
        document.getElementById("message-success").innerHTML = "no file"
      }
    }).catch((err) => {
        document.getElementById("message-error").innerHTML = err
    })
 })

ipc.on("video:update", (event, args) => {
  if(table){
    console.log(args)
    table.rows().data().clear()
    table.draw()
  }
});
