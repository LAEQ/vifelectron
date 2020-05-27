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

const getFile = _ =>{
  const file = document.getElementById('file').files[0]

  return file
}

document.getElementById("speed").addEventListener('change', ev => {

})

document.getElementById('file').addEventListener('change', ev => {
  const file = getFile()
  if(file){
    document.getElementById('preview').src = file.path
  }
})

document.querySelector("form").addEventListener("submit", _ => {
  event.preventDefault()
  const file = getFile()
  if(file){
    ipcRenderer.send("category:create", {name: "test", path: file.path, color: "black", shortcut: "C"})
  }
})

const repository = new Repository()

repository.fetchCategory().then(categories => {
  let html = ""
  categories.forEach(c => {
    console.log(c)
    html += `<div class="card mb-4 shadow-sm">
      <div class="card-header">
        <h4 class="my-0 font-weight-normal">${c.name}</h4>
      </div>
      <div class="card-body">
        <img src="${path.join(settings.icon, c.path)}" width="100", height="100" />
      </div>
    </div>`
  })

  document.getElementById("category-container").innerHTML = html
})
