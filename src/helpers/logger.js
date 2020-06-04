import jetpack from "fs-jetpack";
import path from 'path'

export default class Logger{
  constructor(settings) {
    this.settings = settings
  }

  info(msg){
    jetpack.appendAsync(path.join(this.settings.log, 'info.log'), msg)
  }

  warning(msg){
    jetpack.appendAsync(path.join(this.settings.log, 'warning.log'), msg)
  }

  error(msg){
    jetpack.appendAsync(path.join(this.settings.log, 'error.log'), msg)
  }
}
