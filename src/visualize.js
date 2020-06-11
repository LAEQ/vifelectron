import "./scss/visualize.scss"

import Settings from "./helpers/initialize";
import Repository from "./model/Repository";
import {Statistic} from "./services/statistic";

const hash = global.location.search.split("=")[1];

const repo = new Repository();
let video, categories;

repo.fetchVideoStatistic(hash).then(r => {
  console.log(r)
  const duration = r['video'].duration
  const collection = r['video'].collection
  const videoIds = r['videoIds']

  let result = {}
  videoIds.forEach(id => {
      result[id] = 0
  })

  result['both'] = 0


  r['promises'].then(r => {
    console.log(result)
    const categoryList = r[0]
    const catStat = new Map()
    categoryList.categories.forEach( c => catStat.set(c.id, Object.clone(result)))



    let statistic = new Statistic(r[1], r[2])
    statistic.run()
    // console.log(scc)

    scc.forEach(s => {
      console.log(s)
    })

    // console.log(scc)



  })

  // video = r[0];
  // categories = r[1];
  //
  // let statistic = new Statistic(r[2], r[3])
  //
  // const scc = statistic.run(3)
  //
  // const map = new Map()
  //
  // const step = Math.floor(video.duration / 200 ) * 10
  // let start = 0
  //
  // while(start < video.duration){
  //   map.set(start, {
  //
  //   })
  //
  //
  //
  //   start += step
  // }


})
