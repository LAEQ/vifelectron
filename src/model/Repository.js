import Settings from "../helpers/initialize";
import path from 'path'
import {v4 as uuidv4} from 'uuid'
import jetpack from "fs-jetpack";
import {Category} from "./entity/Category";
import {Collection} from "./entity/Collection";
import {Video} from "./entity/Video";
import {Point} from "./entity/Point"

import {VideoStatistic} from "./entity/VideoStatistic";
import * as SortedSet from 'collections'

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
          if(category.hasOwnProperty('pathPrimary') === false){
            category.pathDefault = path.join(this.settings.icon, category.pathDefault)
            category.pathPrimary = category.pathDefault.replace('default', 'primary')
            category.pathDanger = category.pathDefault.replace('default', 'danger')
          }

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

  async fetchVideosGrouped(){
    const file = this.settings.getVideoPath()
    let videos = []
    let result = []

    if(jetpack.exists(file)){
      await jetpack.readAsync(file, "json").then(r => {
        videos = r.map(video => {
          return new Video(video)
        })
      })

      videos.forEach(v => {
        let collection = result.find(c => c.hash === v.hash)
        if(collection === undefined){
          let collection = new VideoStatistic();
          collection.add(v)
          result.push(collection)
        } else {
          collection.add(v)
        }
      })

      return result
    } else {
      return []
    }
  }

  fetchVideo(id){
    return jetpack.read(this.settings.getVideoPath(), "json").filter(obj => obj.id === id).map(v => new Video(v))[0]
  }

  async fetchPoints(videoId){
    let result = []
    const points = jetpack.read(path.join(this.settings.video, `${videoId}.json`), "json")
    result = points.map(obj => {
        return new Point(obj)
    })

    console.log(result)

    // var r = require("collections/sorted-set")
    // result = r(result)

    return result
  }

  defaultCollection(){
    const collections = jetpack.read(this.settings.getCollectionPath(), "json")

    return collections.filter(c => c.default).map(c => new Collection(c))[0]
  }

 capitalize(s){
    if (typeof s !== 'string') return ''
    return s.charAt(0).toUpperCase() + s.slice(1)
  }

  createCategory(data) {
    //Move file
    const uuid = uuidv4()
    const files = ['default', 'primary', 'danger']

    const values = {
      id: uuid,
      name: data.get('name'),
      pathDefault: "",
      pathPrimary: "",
      pathDanger: "",
      shortcut: data.get('shortcut'),
    }

    files.forEach(f => {
      const file = data.get(f);
      const ext = path.extname(data.get(f).name);
      const src = data.get(f).path
      const dest = path.join(this.settings.icon, `${uuid}-${f}${ext}`);

      values[`path${this.capitalize(f)}`] = dest

      if(ext !== "" && jetpack.exists(src) === 'file'){
        jetpack.copy(src, dest);
      }
    })

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
