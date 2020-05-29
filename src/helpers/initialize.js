import path from "path"
import jetpack from "fs-jetpack";
import * as ffbinaries from "ffbinaries";

var os = require('os')
var platform = `${os.platform()-os.arch()}`
var dest = path.join(__dirname, "binaries")

class Settings {
  constructor() {
    this.homeDir = path.join(require('os').homedir(), "vifeco")
    this.db = path.join(this.homeDir, "db")
    this.icon = path.join(this.homeDir, "icons")
    this.video = path.join(this.homeDir, "video")
    this.binaries = path.join(this.homeDir, "binaries")
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
      r.forEach(d => {
        const filename = path.basename(d)
        const dest = path.join(this.db, filename)
        if(jetpack.exists(dest) === false){
          jetpack.copyAsync(d, dest)
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
        console.log('success')
      })
    }
  }
}

export default Settings
