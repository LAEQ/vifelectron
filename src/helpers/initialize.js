import path from "path"
import jetpack from "fs-jetpack";
import * as ffbinaries from "ffbinaries";
import Repository from "../model/Repository";

var os = require('os')
var platform = `${os.platform()-os.arch()}`


class Settings {
  constructor() {
    this.homeDir = path.join(require('os').homedir(), "vifeco")
    this.db = path.join(this.homeDir, "db")
    this.icon = path.join(this.homeDir, "icons")
    this.video = path.join(this.homeDir, "video")
    this.binaries = path.join(this.homeDir, "binaries")
    this.log = path.join(this.homeDir, "log")
  }

  getErrorLog(){
    return path.join(this.log, "error.log")
  }

  getLog(){
    return path.join(this.log, "info.log")
  }

  getUserPath(){
    return path.join(this.db, "user.json")
  }

  getCategoryPath(){
    return path.join(this.db, "category.json")
  }

  getCollectionPath(){
    return path.join(this.db, "collection.json")
  }

  getVideoPath(){
    return path.join(this.db, "video.json")
  }

  getFfmpegPath(){
    return path.join(this.binaries, "ffmpeg")
  }

  getFfprobePath(){
    return path.join(this.binaries, 'ffprobe')
  }

  init(){
    const dirs = [this.homeDir, this.db, this.icon, this.video, this.binaries]
    dirs.forEach(d => jetpack.dir(d))

    //Add default categories / collection
    jetpack.findAsync(path.join(__dirname, "resources", "json"), {matching: "*.json"}).then(r => {
      r.forEach(file => {
        const filename = path.basename(file)
        const dest = path.join(this.db, filename)
        if(jetpack.exists(dest) === false){
          jetpack.readAsync(file, "json").then(content => {
            jetpack.file(dest, {mode: '0777', content: content})
          })
        }
      })
    })
    //Add default icons
    jetpack.findAsync(path.join(__dirname, "resources", "icons"), {matching: "*.svg"}).then(r => {
      r.forEach(f =>{
        const filename = path.basename(f)
        const dest = path.join(this.icon, filename)
        if(jetpack.exists(dest) === false){
          jetpack.copyAsync(f, dest)
        }
      })
    })

    if(jetpack.exists(this.getFfmpegPath()) === false){
      ffbinaries.downloadBinaries(['ffmpeg', 'ffprobe'], {
        platform: platform, quiet: true, destination: this.binaries}, function(err){
        if(err){
          console.log("Failed to download ffbinaries")
        } else {
          console.log("FFbinaries donwloaded successfully")
        }
      })
    }
  }
}

export default Settings
