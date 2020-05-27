import {Collection} from "./Collection";
import moment from "moment";

export class Video{
  constructor() {
    this.id = 1
    this.name = "video 1"
    this.duration = 123
    this.collection = new Collection()
    this.total = 134
    this.createdAt = moment()
    this.last = 111
  }
}
