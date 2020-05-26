import { remote, ipcRenderer } from "electron";
import jetpack from "fs-jetpack";

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

document.querySelector("#title").innerHTML = "block";

document.getElementById('file').addEventListener('change', ev => {
  const file = document.querySelector('input').files[0]
  if(file){
    document.getElementById('preview').src = file.path
  }
})

document.querySelector("form").addEventListener("submit", _ => {
  event.preventDefault()
  const file = document.querySelector('input').files[0]
  console.log(file)
  if(file){
    ipcRenderer.send("category:create", file.path)
  }
})
