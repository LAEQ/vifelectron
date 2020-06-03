export class VideoStatistic {
  constructor() {
    this.videos = []
    this.name = "";
    this.hash = "";
  }

  add(video){
    if(this.videos.length === 0){
      this.hash = video.hash
      this.name = video.name
    }

    this.videos.push(video)
  }
}
