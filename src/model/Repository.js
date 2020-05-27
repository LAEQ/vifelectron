import Settings from "../helpers/initialize";
import jetpack from "fs-jetpack";
import {Category} from "./entity/Category";
import {Video} from "./entity/Video";

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

  fetchVideo(){
    return [
      new Video(), new Video()
    ]
  }
}

export default Repository;
