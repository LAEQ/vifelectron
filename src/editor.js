import "./scss/app.scss"

import { remote, ipcRenderer } from "electron";
import jetpack from "fs-jetpack";
import {v4 as uuidv4} from "uuid";
import Repository from "./model/Repository";
import {Point} from "./model/entity/Point";
import * as d3 from 'd3'
import $ from 'jquery'
import * as slider from 'bootstrap-slider'

const app = remote.app;
const ipc = remote.ipcMain
const appDir = jetpack.cwd(app.getAppPath());
const repository = new Repository();

const manifest = appDir.read("package.json", "json");
var player = document.querySelector("video")
var overlay = document.getElementById("overlay")
var g = d3.select("svg").append("g")
var timer = document.getElementById("timer")
var catContainer = document.getElementById('container-categories')
var timeSlider = $("#slider").slider( {precision: 2});

const videoId = global.location.search.split("=")[1]
let video, categoryList, pointList, dictValues, visiblePoints = [], durationString

repository.editingVideo(videoId).then(values => {
  dictValues = values
  //Set video
  $('#video-spinner').remove()
  video = values['video']

  var measuredTime = new Date(null);
  measuredTime.setSeconds(video.duration); // specify value of SECONDS
  durationString = measuredTime.toISOString().substr(11, 8);

  document.getElementById("title").innerHTML = video.name
  player.src = video.path

  //Set categories
  categoryList = values['categories']
  let catHTML = "";
  for(let value of categoryList.categories){
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

  //Set points
  pointList = values['points']

  //Set total for categories
  for (let value of pointList.map.values()) {
    categoryList.getId(value.categoryId).total++
  }

  refreshCount()
  refresh()
  timeupdate()
})

//Refresh and display icons
const refresh = _ => {
  const currentTime = player.currentTime
  const pointsToShow = pointList.values().filter(p => p.currentTime > currentTime - 10 && p.currentTime < currentTime)

  let p = d3.select("g")
    .selectAll(".icon")
    .data(pointsToShow);

  p.enter()
    .append('g')
    .attr('class', 'icon')
    .attr('transform', p => `translate(${p.x - 40}, ${p.y - 40})`)
    .append('circle')
    .attr('cx', 40)
    .attr('cy', 40)
    .attr('r', 50)


  d3.selectAll('.icon').append("image")
    .attr("xlink:href", p => categoryList.getId(p.categoryId).pathDefault)
    .attr("width", 80)
    .attr("height", 80)

  p.exit().remove();

  d3.selectAll(".icon").on('click', (d) => {
    removePoint(d)
  })
}
var timeupdate = () => {
  var measuredTime = new Date(null);
  measuredTime.setSeconds(player.currentTime); // specify value of SECONDS
  var MHSTime = measuredTime.toISOString().substr(11, 8);


  timer.value = `${MHSTime} / ${durationString}`
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
  ipcRenderer.send("editor:timeline:toogle", videoId )
})
document.addEventListener('keydown', (ev => {
  const category = categoryList.getKey(ev.key.toUpperCase());

  if(mousePosition && category){
    const values = {
      id: uuidv4(),
      videoId: videoId,
      categoryId: category.id,
      x: mousePosition.layerX,
      y: mousePosition.layerY,
      currentTime: player.currentTime
    }

    category.total++
    refreshCount()
    //
    addPoint(values)
    // video.total++
  }
}))

//Slider
timeSlider.on("slide", ev => {
  // console.log("slide", ev.value)
  // seek(ev.value)
})
timeSlider.on('change', ev => {
  console.log("change", ev.value)
  seek(ev.value.newValue)
})


//Player events
player.oncanplay = _ => {
  ipcRenderer.send('editor:oncanplay', player.currentTime)
}
player.addEventListener('loadedmetadata', function() {
  if (player.buffered.length === 0) return;

  var bufferedSeconds = player.buffered.end(0) - player.buffered.start(0);
  console.log(bufferedSeconds + ' seconds of video are ready to play!');
});
const seek = (value) => {
  if(value > 0 && value < 100){
    const currentTime = (value * player.duration / 100)
    player.currentTime = currentTime
    ipcRenderer.send('editor:oncanplay', player.currentTime)
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
  categoryList.categories.forEach(c => {
    document.getElementById(`${c.id}-counter`).innerHTML = c.total;
  });
}
const addPoint = (values) => {
  const point = new Point(values)
  pointList.add(point)

  repository.savePoints( pointList.values(), videoId)
  ipcRenderer.send("editor:point:add", point)

  refresh()
}
const removePoint = (point) => {
  pointList.remove(point)
  d3.select("g")
    .selectAll(".icon")
    .data([])
    .exit().remove()

  categoryList.getId(point.categoryId).total--
  refreshCount()

  repository.savePoints( pointList.values(), videoId)
  refresh()

  ipcRenderer.send("editor:point:delete", point)
}
//IPC
ipc.on('controls:rate', (event, args) => {
  player.playbackRate = args
})
ipc.on('timeline:icon:mouseover', ((event, args) => {
  d3.select("g").selectAll(".icon").filter( p => p.id === args.id).attr("xlink:href", p => categoriesById[p.categoryId].pathAlert)
}))
ipc.on('timeline:icon:mouseout', ((event, args) => {
  d3.select("g").selectAll(".icon").filter( p => p.id === args.id).attr("xlink:href", p => categoriesById[p.categoryId].pathDefault)
}))
ipc.on("timeline:opening", _ => {
  const values = {
    "paused": player.paused,
    "currentTime": player.currentTime
  }

  ipcRenderer.send("timeline:opened", values)
})
