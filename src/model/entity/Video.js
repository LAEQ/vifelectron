import {Collection} from "./Collection";
import * as crypto from 'crypto'

export class Video{
  constructor(obj) {
    let hasher = crypto.createHash('md5')
    this.id = obj.id
    this.name = obj.name
    this.hash = hasher.update(obj.name).digest('hex');
    this.path = obj.path
    this.duration = obj.duration
    this.collection = new Collection(obj.collection)
    this.total = obj.total
  }
}
