import { remote, ipcRenderer } from "electron";
import jetpack from "fs-jetpack";
import path from 'path';
import Repository from "./model/Repository";
import Settings from "./helpers/initialize";

const app = remote.app;
const appDir = jetpack.cwd(app.getAppPath());
const settings = new Settings();

// Holy crap! This is browser window with HTML and stuff, but I can read
// files from disk like it's node.js! Welcome to Electron world :)
const manifest = appDir.read("package.json", "json");

const osMap = {
  win32: "Windows",
  darwin: "macOS",
  linux: "Linux"
};

var player = document.querySelector("video")

document.getElementById("title").innerHTML = "Editor title"

document.querySelector('form').addEventListener('submit', (event) => {

  event.preventDefault()
  const file = document.getElementById('file').files[0]
  console.log(file)

  player.src = file.path
  player.play()
})

document.getElementById("speed").addEventListener('input', ev => {
  let rate = parseFloat(ev.target.value)
  console.log(rate)
  document.querySelector("video").playbackRate = rate
})

ipcRenderer.on('video:metadata', (event, video) => {
  const file = path.join(settings.video, "test.mp4")

  player.src = file
  player.play()

  console.log(video.bufferedAmount)
})


ipcRenderer.on("video:rate", ((event, args) => {
  console.log(args)
}))
