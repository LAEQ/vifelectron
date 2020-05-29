import Settings from "../helpers/initialize";
import path from 'path'
import {v4 as uuidv4} from 'uuid'
import jetpack from "fs-jetpack";
import {Category} from "./entity/Category";
import {Collection} from "./entity/Collection";
import {Video} from "./entity/Video";
import {Point} from "./entity/Point"

class Repository {
  constructor() {
    this.settings = new Settings();
  }

  async fetchCategory(){
    const file = this.settings.getCategoryPath()
    let result = []

    if(jetpack.exists(file)){
      await jetpack.readAsync(file, "json").then(r => {
        result = r.map(category => {
          return new Category(category)
        })
      })

      return result
    } else {
      return result
    }
  }

  async fetchVideos(){
    const file = this.settings.getVideoPath()
    let result = []

    if(jetpack.exists(file)){
      await jetpack.readAsync(file, "json").then(r => {
        result = r.map(video => {
          return new Video(video)
        })
      })

      return result
    } else {
      return result
    }
  }

  fetchVideo(id){
    return jetpack.read(this.settings.getVideoPath(), "json").filter(obj => obj.id === id).map(v => new Video(v))[0]
  }

  async fetchPoints(videoId){
    let result = []
    const points = jetpack.read(path.join(this.settings.video, `${videoId}.json`), "json")
    return points.map(obj => {
        return new Point(obj)
    })
  }

  defaultCollection(){
    const collections = jetpack.read(this.settings.getCollectionPath(), "json")

    return collections.filter(c => c.default).map(c => new Collection(c))[0]
  }

  createCategory(data) {
    //Move file
    const filename = path.basename(data.get('file').path)
    console.log(data.get('file'))
    const uuid = uuidv4()
    jetpack.copy(data.get('file').path, path.join(this.settings.icon, filename))

    const values = {
      id: uuid,
      name: data.get('name'),
      path: filename,
      shortcut: 'Z'
    }

    const category = new Category(values)

    return category
  }

  save(obj, filename){
    jetpack.write(path.join(this.settings.db,filename), obj);
  }

  savePoints(points, videoId) {
    jetpack.write(path.join(this.settings.video, `${videoId}.json`), points)
  }
}

export default Repository;
