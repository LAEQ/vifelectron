import { electron, remote, ipcRenderer } from "electron";
import jetpack from "fs-jetpack";
import path from 'path';
import Settings from "./helpers/initialize";
import Repository from "./model/Repository";
import {Point} from "./model/entity/Point";

const app = remote.app;
const ipc = remote.ipcMain
const appDir = jetpack.cwd(app.getAppPath());
const settings = new Settings();
const repository = new Repository();

const manifest = appDir.read("package.json", "json");
var player = document.querySelector("video")
var catContainer = document.getElementById('icons')

const videoId = global.location.search.split("=")[1]
const video = repository.fetchVideo(videoId)
var points = []

repository.fetchPoints(videoId).then(r => {
  points = r
  player.src = video.path
})

player.oncanplay = _ => {
  player.play()
}

player.addEventListener("playing", _ => {
  timerFetch()
})


var fetchTimer ;
var saveTimer;

function fetchPoint() {
  // console.log("Total points: " + points.length)
  document.getElementById("total").innerHTML = "Total points: " + points.length
}

function timerFetch(){
  fetchPoint();

  fetchTimer = setTimeout(timerFetch, 1000)
}

function timerSaveVideo(){

}

document.getElementById("title").innerHTML = video.name

repository.fetchCategory().then(categories => {
  let image = "";
  categories.forEach(c => {
    let filePath = path.join(settings.icon, c.path)
    image += `<li class="list-group-item"><img src="${filePath}" id="${c.name}" class="" /></li>`

  })
  catContainer.innerHTML = image
})

//Controls
document.getElementById("play").addEventListener("click", _ =>{
  player.play()
})

document.getElementById("stop").addEventListener("click", _ =>{
  player.pause()
  if(fetchTimer){
    clearTimeout(fetchTimer)
  }
})

var mousePosition;

player.addEventListener('mouseout', _ =>{
  mousePosition = undefined
})

player.addEventListener('mousemove', ev => {
  mousePosition = ev;
})

document.addEventListener('keydown', (ev => {
  if(mousePosition){
    const values = {
      videoId: videoId,
      categoryId: 1,
      x: mousePosition.layerX,
      y: mousePosition.layerY,
      currentTime: player.currentTime
    }
    let point = new Point(values)

    points.push(point)

    video.total = points.length

    ipcRenderer.send('point:add', point)
  }
}))

ipc.on("point:add", (event, args) => {
  repository.savePoints(points, videoId)
})

