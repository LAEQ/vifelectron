import "./scss/visualize.scss"

import Repository from "./model/Repository";
import {Statistic} from "./services/statistic";
import * as d3 from 'd3'

const hash = global.location.search.split("=")[1];

const repo = new Repository();
let video, categories;

repo.fetchVideoStatistic(hash).then(r => {
  console.log(r)
  const duration = r['video'].duration
  const collection = r['video'].collection
  const videoIds = r['videoIds']



  r['promises'].then(r => {
    const catIds = r[0].categories.map(c => c.id)


    let statistic = new Statistic(videoIds, catIds, r[1], r[2])
    statistic.connect(5)
    statistic.tarjan()
    const result = statistic.statByCategory()
    console.log(result)

    var svg = d3.select('svg')
      .attr("width", 650)
      .attr("height", 250)

    var stack = d3.layout.stack()

    stack(result)

  });
});
