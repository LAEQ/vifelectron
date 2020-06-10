import "./scss/app.scss"

import { remote, ipcRenderer } from "electron";
import Repository from "./model/Repository";
import * as d3 from 'd3'
import $ from 'jquery'
import * as slider from 'bootstrap-slider'
import {VideoEditor} from "./services/videoeditor";
import ffmpeg from "fluent-ffmpeg";
import Settings from "./helpers/initialize";

const ipc = remote.ipcMain
const repository = new Repository();
const settings = new Settings();

var player = document.querySelector("video");
var overlay = document.getElementById("overlay");
var timer = document.getElementById("timer");
var catContainer = document.getElementById('container-categories');
var timeSlider = $("#slider").slider( {precision: 2});
var g = d3.select("svg").append("g")

const videoId = global.location.search.split("=")[1];
let editor, mousePosition;


repository.editingVideo(videoId).then(values => {
  editor = new VideoEditor(values)
  $('#video-spinner').remove()

  document.getElementById("title").innerHTML = editor.video.name
  player.src = editor.video.path

  let catHTML = "";
  for(let value of editor.categoryList.categories){
      value.total = 0
        catHTML += `<div class="list-group-item">
                <div class="d-flex w-100 justify-content-between">
              <img class="d-flex mb-1" width="70" src="${value.pathDefault}" id="${value.name}" ></img>
              <div class="h1 d-flex align-self-center" id="${value.id}-counter">${value.total}</div>
            </div>
            <small>${value.name} - <span class="border border-secondary p-1">${value.shortcut}</span></small>
         </div>`
  }

  catContainer.innerHTML = catHTML;

  ffmpeg.setFfmpegPath(settings.getFfmpegPath())
  ffmpeg.setFfprobePath(settings.getFfprobePath())

  ffmpeg.ffprobe(editor.video.path, (err, metadata) =>{
    if(err === null){
      editor.init(metadata)
      refreshCount()
    } else {

    }
  })
})


const refresh = _ => {
  const pointsToShow = editor.visible(player.currentTime)
  console.log('refresh')
  let p = g.selectAll(".icon").data(pointsToShow);

  p.enter()
    .append('g')
    .attr('class', 'icon')
    .attr('transform', p => `translate(${editor.x(p.x) - 40}, ${editor.y(p.y) - 40})`)
    .append('circle')
    .attr('cx', 40)
    .attr('cy', 40)
    .attr('r', 50)

  d3.selectAll('.icon').append("image")
    .attr('class', 'iconSVG')
    .attr("xlink:href", p => editor.default(p.categoryId))
    .attr("width", 80)
    .attr("height", 80)

  p.exit().remove();

  d3.selectAll(".icon").on('click', (p) => {
    deletePoint(p)
  })
}
var timeupdate = () => {
  timer.value = editor.timer(player.currentTime)
  timeSlider.slider('setValue', editor.timerSlider(player.currentTime));
  refresh()
}

// player.addEventListener("timeupdate", timeupdate)
player.addEventListener('playing', _ => {
  ipcRenderer.send("editor:playing", player.currentTime)
})

//Video controls
document.getElementById("play").addEventListener("click", _ =>{
  player.play()
})
document.getElementById("stop").addEventListener("click", _ =>{
  player.pause()
  ipcRenderer.send("editor:stop")
})
document.getElementById("controls").addEventListener("click", _ => {
  ipcRenderer.send("controls:show-hide")
})

document.getElementById("timeline").addEventListener("click", _ => {
  ipcRenderer.send("editor:timeline:toogle", videoId )
})
document.addEventListener('keydown', (ev => {
  if(mousePosition) {
    const point = editor.addPoint(mousePosition, ev.key.toUpperCase(), player.currentTime)
    if(point !== undefined){
      repository.savePoints(editor.pointList.values(), videoId)
      ipcRenderer.send('editor:point:add', point)
      refresh()
      refreshCount()
    }
  }
}))

//Slider
timeSlider.on("slide", ev => {
  // console.log("slide", ev.value)
  // seek(ev.value)
})
timeSlider.on('change', ev => {
  seek(ev.value.newValue)
})


let init = true

//Player events
player.oncanplay = _ => {
  ipcRenderer.send('editor:oncanplay', player.currentTime)

  if(init){
    init = false
    editor.setContainer(document.getElementById('video-container'))
    player.addEventListener("timeupdate", timeupdate)
    timeupdate()
  }
}

player.addEventListener('loadedmetadata', function() {
  if (player.buffered.length === 0) return;

  var bufferedSeconds = player.buffered.end(0) - player.buffered.start(0);
  console.log(bufferedSeconds + ' seconds of video are ready to play!');
});

//Overlay events
overlay.addEventListener('mouseout', _ =>{
  mousePosition = undefined
})
overlay.addEventListener('mousemove', ev => {
  mousePosition = ev;
})

const seek = (value) => {
  if(value > 0 && value < 100){
    const currentTime = (value * player.duration / 100)
    player.currentTime = currentTime
    ipcRenderer.send('editor:oncanplay', player.currentTime)
  }
}
const refreshCount = _ => {
  editor.categoryList.categories.forEach(c => {
    document.getElementById(`${c.id}-counter`).innerHTML = c.total;
  });
}
const deletePoint = (point) => {
  if(editor.deletePoint(point)){
    g.selectAll(".icon")
      .data([])
      .exit().remove()

    refreshCount()
    refresh()

    ipcRenderer.send("editor:point:delete", point)
  }
}


//Listen events
ipc.on('controls:rate', (event, args) => {
  player.playbackRate = args
})
ipc.on('timeline:icon:mouseover', ((event, args) => {
  g.selectAll(".iconSVG").filter( p => p.id === args.id).attr("xlink:href", p => editor.alert(p.categoryId))
}))
ipc.on('timeline:icon:mouseout', ((event, args) => {
  g.selectAll(".iconSVG").attr("xlink:href", p => editor.default(p.categoryId))
}))
ipc.on("timeline:opening", _ => {
  const values = {
    "paused": player.paused,
    "currentTime": player.currentTime
  }

  ipcRenderer.send("timeline:opened", values)
})
