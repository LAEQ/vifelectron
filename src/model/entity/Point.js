import {VertexPoint} from "../../services/statistic";

class Point{
  constructor(obj) {
    this.id = obj.id
    this.videoId = obj.videoId
    this.categoryId = obj.categoryId
    this.x = obj.x
    this.y = obj.y
    this.currentTime = obj.currentTime
  }
}

class PointList{
  constructor(json) {
    this.map = new Map()

    json.forEach(obj => {
      const pt = new Point(obj)
      this.map.set(pt.id, pt)
    })
  }

  debug(){
    console.log(Array.from(this.map.keys()))
  }

  add(point){
    this.map.set(point.id, point)
  }

  remove(point){
    return this.map.delete(point.id)
  }

  values(){
    return Array.from(this.map.values())
  }

  size(){
    return this.map.size
  }

  vertices(){
    return this.values().map(p => new VertexPoint(p))
  }
}

export {Point, PointList}
