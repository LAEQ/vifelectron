import path from "path"
import jetpack from "fs-jetpack";

class Settings {
  constructor() {
    this.homeDir = path.join(require('os').homedir(), "vifeco")
    this.db = path.join(this.homeDir, "db")
    this.icon = path.join(this.homeDir, "icons")
    this.video = path.join(this.homeDir, "video")
  }

  getCategoryPath(){
    return path.join(this.db, "category.json")
  }

  init(){
    const dirs = [this.homeDir, this.db, this.icon, this.video]
    dirs.forEach(d => jetpack.dir(d))


    //Add default categories / collection
    jetpack.findAsync(path.join(jetpack.cwd(), "resources", "fixtures"), {matching: "*.json"}).then(r => {
      r.forEach(d => {
        const filename = path.basename(d)
        const dest = path.join(this.db, filename)
        if(jetpack.exists(dest) === false){
          jetpack.copyAsync(d, dest)
        }
      })
    })
    //Add default icons
    jetpack.findAsync(path.join(jetpack.cwd(), "resources", "icons"), {matching: "*.svg"}).then(r => {
      r.forEach(f =>{
        const filename = path.basename(f)
        const dest = path.join(this.icon, filename)
        if(jetpack.exists(dest) === false){
          jetpack.copyAsync(f, dest)
        }
      })
    })
  }
}

export default Settings
