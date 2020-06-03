import "./scss/app.scss"

import { remote, ipcRenderer } from "electron";
import jetpack from "fs-jetpack";
import path from 'path';
import Settings from "./helpers/initialize";
import Repository from "./model/Repository";
import {Point} from "./model/entity/Point";
import * as moment from 'moment';
import * as d3 from 'd3'
import $ from 'jquery'
import * as slider from 'bootstrap-slider'

const app = remote.app;
const ipc = remote.ipcMain
const appDir = jetpack.cwd(app.getAppPath());
const settings = new Settings();
const repository = new Repository();

const manifest = appDir.read("package.json", "json");
var player = document.querySelector("video")
var overlay = document.getElementById("overlay")
var g = d3.select("svg").append("g")
var timer = document.getElementById("timer")
var catContainer = document.getElementById('container-categories')
var timeSlider = $("#slider").slider( {precision: 2});

const videoId = global.location.search.split("=")[1]
const video = repository.fetchVideo(videoId)
let categories = []
let categoriesByKey = {}
let categoriesById = {}
let img = []

let points = []

document.getElementById("title").innerHTML = video.name
d3.select("g")
  .selectAll(".icon")
  .data([])
  .enter()
  .append("image")
  .attr("xlink:href", p => categoriesById[p.categoryId].path)
  .attr('class', 'icon')
  .attr("width", 80)
  .attr("height", 80)
  .attr("x", 10)
  .attr("y", 10);

player.oncanplay = _ => {
  ipcRenderer.send('editor:oncanplay', player.currentTime)
}

const durationSort = (a, b) => {
  return a.currentTime - b.currentTime
}
const pointPromise = repository.fetchPoints(videoId)
const categoryPromise = repository.fetchCategory()

Promise.all([pointPromise, categoryPromise]).then(values => {
  points = values[0]
  player.src = video.path

  // console.log(points.map(p => p.currentTime))
  // const test = points.filter( p => p.currentTime < 10 && p.currentTime > 0)
  // console.log(test.toArray())

  let image = "";
  categories = values[1];
  categories.forEach(c => {
    categoriesByKey[c.shortcut] = c
    categoriesById[c.id] = c
    c.total = points.filter(p => p.categoryId == c.id).length
    image += `<div class="list-group-item">
                <div class="d-flex w-100 justify-content-between">
                  <img class="d-flex mb-1" width="70" src="${c.path}" id="${c.name}" ></img>
                  <div class="h1 d-flex align-self-center" id="${c.id}-counter">${c.total}</div>
                </div>
                <small>${c.name} - <span class="border border-secondary p-1">${c.shortcut}</span></small>
             </div>`

  })
  catContainer.innerHTML = image

  ipcRenderer.send('editor:video:metadata:response',{video: video, points: points, catById: categoriesById})
})

//Refresh and display icons
const refresh = _ => {
  const currentTime = player.currentTime
  const pointsToShow = points.filter(p => p.currentTime > currentTime - 10 && p.currentTime < currentTime)

  let p = d3.select("g")
    .selectAll(".icon")
    .data(pointsToShow.toArray())

  p.enter().append("image")
    .attr("xlink:href", p => categoriesById[p.categoryId].path)
    .attr('class', 'icon')
    .attr("width", 80)
    .attr("height", 80)
    .attr("x", p => p.x)
    .attr("y", p => p.y);

  p.exit().remove();
}
var timeupdate = (event) => {
  const now = moment.duration(player.currentTime)

  timer.value = `${now.toISOString('H:m:s')} / ${video.duration.toLocaleString()}`
  timeSlider.slider('setValue', player.currentTime / video.duration * 100);

  refresh()
}

player.addEventListener("timeupdate", timeupdate)
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
  ipcRenderer.send("editor:timeline", points)
})
document.addEventListener('keydown', (ev => {
  const category = categoriesByKey[ev.key.toUpperCase()]
  if(mousePosition && category){
    const values = {
      videoId: videoId,
      categoryId: category.id,
      x: mousePosition.layerX,
      y: mousePosition.layerY,
      currentTime: player.currentTime
    }

    category.total++
    refreshCount()

    addPoint(values)
    video.total++
  }
}))

//Slider
timeSlider.on("slide", ev => {
  seek(ev.value)
})
timeSlider.on('change', ev => {
  seek(ev.value)
})


//Video
player.addEventListener('loadedmetadata', function() {
  if (player.buffered.length === 0) return;

  var bufferedSeconds = player.buffered.end(0) - player.buffered.start(0);
  console.log(bufferedSeconds + ' seconds of video are ready to play!');
});
const seek = (value) => {
  if(value > 0 && value < 100){
    const currentTime = Math.floor(value * player.duration / 100)
    player.currentTime = currentTime
  }
}
var mousePosition;
overlay.addEventListener('mouseout', _ =>{
  mousePosition = undefined
})
overlay.addEventListener('mousemove', ev => {
  mousePosition = ev;
})

const refreshCount = _ => {
  categories.forEach(c => {
    document.getElementById(`${c.id}-counter`).innerHTML = c.total;
  });
}
const addPoint = (values) => {
  const point = new Point(values)
  points.push(point)

  repository.savePoints(points, videoId)
  ipcRenderer.send("editor:point:add", point)
}


//IPC
ipc.on("point:add", (event, args) => {
  repository.savePoints(points, videoId)
})
ipc.on('controls:rate', (event, args) => {
  player.playbackRate = args
})
ipc.on('editor:video:metadata:request', _ => {
  ipcRenderer.send('editor:video:metadata:response', {video: video, points: points.toArray(), catById: categoriesById})
})
ipc.on('timeline:icon:mouseover', ((event, args) => {
  d3.select("g").selectAll(".icon").filter( p => p.id === args.id).attr("xlink:href", p => categoriesById[p.categoryId].pathDanger)
}))
ipc.on('timeline:icon:mouseout', ((event, args) => {
  d3.select("g").selectAll(".icon").filter( p => p.id === args.id).attr("xlink:href", p => categoriesById[p.categoryId].path)
}))
