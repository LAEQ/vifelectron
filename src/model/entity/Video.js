import {Collection} from "./Collection";
import moment from "moment";

export class Video{
  constructor(obj) {
    this.id = obj.id
    this.name = obj.name
    this.path = obj.path
    this.duration = obj.duration
    this.collection = new Collection(obj.collection)
    this.total = obj.total
  }
}
