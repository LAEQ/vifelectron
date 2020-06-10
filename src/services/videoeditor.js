import {v4 as uuidv4} from "uuid";
import {Point} from "../model/entity/Point";

export class VideoEditor{
  constructor(values) {
    console.log(values)
    this.video = values['video'];
    this.categoryList = values['categories'];
    this.pointList = values['points'];
    this.metadata = undefined;
    var measuredTime = new Date(null);
    measuredTime.setSeconds(this.video.duration);
    this.durationString = measuredTime.toISOString().substr(11, 8);
  }

  isKeyValid(key){
    return this.categoryList.keys.includes(key);
  }

  init(meta){
    this.metadata = meta
    for (let value of this.pointList.map.values()) {
      this.categoryList.increment(value.categoryId)
    }

    //Read video metadata
    const index = this.metadata['streams'][0]['codec_type'] === "audio" ? 0 : 1;
    this.audioStream = this.metadata['streams'][index]
    this.videoStream = index === 0 ? this.metadata['streams'][1] : this.metadata['streams'][0]
    this.width = this.videoStream['coded_width']
    this.height = this.videoStream['coded_height']
  }

  setContainer(container){
    this.container = container
    this.playerWidth = container.offsetWidth
    this.playerHeight = container.offsetHeight
  }

  getX(x){
    return x.layerX * this.width / this.playerWidth;
  }

  getY(y){
    return y.layerY * this.height / this.playerHeight;
  }

  x(x){
    return x * this.playerWidth / this.width;
  }

  y(y){
    return y * this.playerHeight / this.height;
  }

  deletePoint(point){
    if(this.pointList.remove(point)){
      this.categoryList.decrement(point.categoryId);
      return true;
    }

    return false;
  }

  addPoint(position, key, time){
    if(this.categoryList.keys.includes(key)){
      const category = this.categoryList.mapKey.get(key)
      const point = new Point({
          id: uuidv4(),
          videoId: this.video.id,
          categoryId: category.id,
          x: this.getX(position),
          y: this.getY(position),
          currentTime: time
        })

      this.pointList.add(point)
      category.total++

      return true;
    }

    return false;
  }

  visible(time){
    return this.pointList.values().filter(p => p.currentTime > time - 1 && p.currentTime <= time)
  }

  timer(time){
    const measuredTime = new Date(null);
    measuredTime.setSeconds(time); // specify value of SECONDS
    const MHSTime = measuredTime.toISOString().substr(11, 8);

    return `${MHSTime} / ${this.durationString}`
  }

  timerSlider(time){
    return time / this.video.duration * 100
  }

  default(id){
    return this.categoryList.getId(id).pathDefault
  }
}

