import {v4 as uuidv4} from "uuid";



export class Point{
  constructor(obj) {
    this.id = uuidv4()
    this.videoId = obj.videoId
    this.categoryId = obj.categoryId
    this.x = obj.x
    this.y = obj.y
    this.currentTime = obj.currentTime
  }
}
