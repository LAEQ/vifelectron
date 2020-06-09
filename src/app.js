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

// var test = require('collections/sorted-map')()
// test.set(1, 'est')
// console.log(test.values().next())

let d = dt()
let dialog = remote.dialog
var settings = new Settings()
var repository = new Repository()
var videos, table;

repository.fetchVideos().then(result => {
  videos = result;
  showLastVideo(videos)

  table = $('#table').DataTable({
    "data": Array.from(videos.values()),
    "columns": [
      { "data": "hash", title: "#" },
      { "data": "name", title: "name"},
      { "data": "duration", title: "duration"},
      { "data": "collection", title: "collection", render: (data) => {
        return data.name + "<button class='btn btn-sm btn-outline-secondary ml-3' data-action='collection-change'>change</button>"
      }},
      { "data": "total", title: "total"},
      { "data": null, title: "delete"},
      { "data": null, title: "actions"}
    ],
    "columnDefs": [
      {targets: 0, render: function(id) {
          const src = path.join(settings.video, id)
          return `<img src="${src}.png" width="130" />`
        }},
      {"targets": -2, "data": null, "defaultContent":
            "<button type='button' class='btn btn-sm btn-outline-danger mr-2' data-action='delete'>Delete</button>"
      },
      {"targets": -1, "data": null, "defaultContent": "" +
          "<button type='button' class='btn btn-sm btn-warning mr-2' data-action='info'>Info</button>" +
          "<button type='button' class='btn btn-sm btn-info mr-2' data-action='edit'>Edit</button>" +
          "<button type='button' class='btn btn-sm btn-success mr-2' data-action='count'>Count</button>"}
    ]
  });

  $('#table tbody').on( 'click', 'button', function (evt) {
    var data = table.row( $(this).parents('tr') ).data();

    let evtName;

    switch ($(this).data('action')) {

      case "info":
        evtName = "video:tool";
        break;
      case "collection-change":
          evtName = "video:collection:change";
        break;
      case "edit":
        evtName = "video:edit";
        break;
      case "delete":
        evtName = "video:delete";
        break;
      default:
        evtName = "editor:open"
        break
    }

    ipcRenderer.send(evtName, data.id)
  });
})

const showLastVideo = (videos) => {
  if(videos.size > 0){
    const video = videos.entries().next().value[1]
    const filePath = path.join(settings.video, `${video.hash}.png`)
    const html = `<div class="col-md-4">
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
                <div class=""><button id="last-video-start-btn" class="btn btn-outline-success btn-lg" data-video="${video.id}">Start</button></div>
              </div>`

    document.getElementById('latest-video-section').innerHTML = html;
    document.getElementById("last-video-start-btn").addEventListener('click', ev => {
      const id = $(ev.target).data('video');
      ipcRenderer.send("editor:open", id);
    });
  } else {
    document.getElementById('latest-video-section').innerHTML = `<div class="col-12">No video</div>`
  }
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
        videos.set(id, video)

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
            filename: `${video.hash}.png`,
            folder: settings.video,
            size: '520x?'
          }).on('end', _ => {
            console.log(Array.from(videos.values()))
            repository.save(Array.from(videos.values()), "video.json")
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
    table.rows().data().clear()
    table.draw()
  }
});

ipc.on("video:delete", ((event, args) => {
  let response = dialog.showMessageBoxSync(remote.getCurrentWindow(), {
    buttons: ["NO", "YES"],
    message: `Are you sure you want to delete this video.`
  })

  if(response === 1){
    videos.delete(args)
    repository.save(Array.from(videos.values()), 'video.json')

    table.clear().rows.add(Array.from(videos.values())).draw();
    showLastVideo(videos)
  }
}))

ipc.on("video:collection:change", ((event, args) => {

}))
