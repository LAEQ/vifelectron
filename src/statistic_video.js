import "./scss/app.scss"

import { remote, ipcRenderer } from "electron";
import jetpack from "fs-jetpack";
import path from "path"
import $ from 'jquery'
import dt from 'datatables'
import 'bootstrap';

import Settings from "./helpers/initialize";
import Repository from "./model/Repository";
const app = remote.app;
const ipc = remote.ipcMain


let d = dt()
let dialog = remote.dialog
var settings = new Settings()
var repository = new Repository()
var table, videoStatistic
console.log("statistic video")

repository.fetchVideosGrouped().then(r => {
  videoStatistic = r

  table = $('#table').DataTable({
    "data": videoStatistic,
    "columns": [
      { "data": "hash", title: "#"},
      { "data": "name", title: "name" },
      { "data": "videos", title: "total"},
      { "data": null, title: "actions"}
    ],
    "columnDefs": [
      {targets: 0, render: function(id) {
          const src = path.join(settings.video, id)
          return `<img src="${src}.png" width="130" />`
       }
      },{"targets": 2, render: (videos) => { return videos.length }
      },{"targets": -1, "data": null, "defaultContent": "<button type='button' class='btn btn-sm btn-info mr-2' data-action='edit'>Visualize</button>"}
    ]
  });

  $('#table tbody').on( 'click', 'button', function () {
    var data = table.row($(this).parents('tr')).data();
    console.log(data)
    ipcRenderer.send("statistic:visualize", data.hash)


  });

}).catch(err => console.log(err))


