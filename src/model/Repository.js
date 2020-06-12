import Settings from "../helpers/initialize";
import path from 'path'
import {v4 as uuidv4} from 'uuid'
import jetpack from "fs-jetpack";
import {Category, CategoryList} from "./entity/Category";
import {Collection} from "./entity/Collection";
import {Video} from "./entity/Video";
import {Point, PointList} from "./entity/Point"
import {VideoStatistic} from "./entity/VideoStatistic";

import * as SortedSet from 'collections'
import {User} from "./entity/User";

class Repository {
  constructor() {
    this.settings = new Settings();
  }

  async fetchUsers(){
    const file = this.settings.getUserPath()
    let result = []

    if(jetpack.exists(file)){
      await jetpack.readAsync(file, "json").then(r => {
        result = r.map(obj => {
          return new User(obj)
        })
      })

      return result
    } else {
      return result
    }
  }

  createUser(form) {
    const uuid = uuidv4()
    const files = ['default', 'primary', 'alert']

    const values = {
      id: uuid,
      name: form[0].value,
      default: false
    }

    const user = new User(values)

    return user
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
    let result = new Map()

    if(jetpack.exists(file)){
      await jetpack.readAsync(file, "json").then(r => {
        r.forEach(video =>
          result.set(video.id, new Video(video)))
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

  async editingVideo(videoId){
    const video = this.fetchVideo(videoId)
    const categories = this.fetchCategories(video.collection.categoryIds)
    const points = this.fetchPoints(videoId)

    return Promise.all([categories, points]).then(values => {
      return {
        'video': video,
        'categories': values[0],
        'points': values[1]
      }
    })
  }

  async fetchCategories(ids){
    return jetpack.readAsync(this.settings.getCategoryPath(), 'json' ).then( json => {
      const categories = []
      json.forEach(j => {
        if(ids.includes(j.id)){
          categories.push(this.generateCategory(j));
        }
      });

      return new CategoryList(categories)
    });
  }

  generateCategory(obj){
    let category = new Category(obj)
    category.pathDefault = path.join(this.settings.icon, obj.pathDefault)
    category.pathPrimary = path.join(this.settings.icon, obj.pathDefault.replace('default', 'primary'))
    category.pathDanger = path.join(this.settings.icon, obj.pathDefault.replace('default', 'danger'))

    return category
  }

  fetchVideo(id){
    var json = jetpack.read(path.join(this.settings.db, 'video.json'), 'json')
    let video;

    for(let i = 0; i < json.length; i++){
      if(json[i].id === id){
        return new Video(json[i])
      }
    }

    if(video === undefined){
      //@todo log no video found
      throw 'No video found.'
    }
  }

  async fetchPoints(videoId){
    return jetpack.readAsync(path.join(this.settings.video, `${videoId}.json`), "json").then(json => {
      return new PointList(json)
    })
  }

  defaultCollection(){
    const collections = jetpack.read(this.settings.getCollectionPath(), "json")

    return collections.filter(c => c.default).map(c => new Collection(c))[0]
  }

  capitalize(s){
    if (typeof s !== 'string') return ''
    return s.charAt(0).toUpperCase() + s.slice(1)
  }

  createCategory(form) {
    const uuid = uuidv4()
    const files = ['default', 'primary', 'alert']

    const values = {
      id: uuid,
      name: form[0].value,
      pathDefault: "",
      pathPrimary: "",
      pathDanger: "",
      shortcut: form[1].value,
    }

    const filing = (f, type) => {
      const file = f.files[0]
      const ext = path.extname(file.name);
      const src = file.path
      const dest = path.join(this.settings.icon, `${uuid}-${type}${ext}`)

      if(ext !== "" && jetpack.exists(src) === 'file'){
        jetpack.copy(src, dest);
      }

      values[`path${this.capitalize(type)}`] = dest
    }

    filing(form[2], 'default')
    filing(form[3], 'primary')
    filing(form[4], 'alert')

    const category = new Category(values)

    return category
  }

  save(obj, filename){
    jetpack.write(path.join(this.settings.db,filename), obj);
  }

  savePoints(points, videoId) {
    jetpack.write(path.join(this.settings.video, `${videoId}.json`), points)
  }

  async fetchCollection(){
    const file = this.settings.getCollectionPath()
    let result = []

    if(jetpack.exists(file)){
      await jetpack.readAsync(file, "json").then(r => {
        result = r.map(c => {
          return new Collection(c)
        })
      })

      return result
    } else {
      return result
    }
  }

  createCollection(form) {
    const collection = new Collection({
      id: uuidv4(),
      name: form[0].value,
      default: false,
      categoryIds: form[1].value.split(";").sort()
    })

    return collection;
  }

  async fetchCategoryByCollection(collection) {
      const file = this.settings.getCategoryPath()
      let result = []

      if(jetpack.exists(file)){
        await jetpack.readAsync(file, "json").then(r => {
          result = r.map(category => {
            if(category.hasOwnProperty('pathPrimary') === false){
              category.pathDefault = path.join(this.settings.icon, category.pathDefault)
              category.pathPrimary = category.pathDefault.replace('default', 'primary')
              category.pathAlert = category.pathDefault.replace('default', 'danger')
            }

            return new Category(category)
          })
        })

        return result.filter( c => collection.categoryIds.includes(c.id))
      } else {
        return result
      }
  }

  deleteFilesIfExist(id){
    jetpack.findAsync(path.join(this.settings.video), {matching: `${id}.*`}).then(r => {
      r.forEach(file => {
        if(jetpack.exists(file) === 'file'){
          jetpack.removeAsync(file)
        }
      })
    })
  }

  deleteVideo(video) {
    this.fetchVideos().then(videoList => {
      const list = videoList.delet(video.id)
      this.save(list, 'video.json')
      this.deleteFilesIfExist(video.id)
    })
  }

  saveVideo(video) {
    this.fetchVideos().then( videos => {
        videos.set(video.id, video)

        this.save(videos, "video.json")
    })
  }

  async fetchVideoStatistic(hash) {
    const json = jetpack.read(path.join(this.settings.db, 'video.json'), "json")
    const videoIds = json.filter(j => j.hash === hash).map( j => j.id)
    const video = this.fetchVideo(videoIds[0])
    let promises = [this.fetchCategories(video.collection.categoryIds)]
    promises = promises.concat(videoIds.map(id => this.fetchPoints(id)))
    return {
        "video": video,
        "videoIds": videoIds,
        "promises": Promise.all(promises)
    }
  }


}

export default Repository;
