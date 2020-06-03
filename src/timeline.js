import "./scss/app.scss"
import * as d3 from 'd3'
import { remote, ipcRenderer } from "electron";

const ipc = remote.ipcMain

var svg = d3.select('svg');
const scale = svg.append('g').attr('class', 'scale');
var scaleBar = [];
var settings;
var video;
var points;
var catById;
var icons = {};
var scaleLength = 0;
var scaleDuration = 0;
var transition;
var yIndex = 0;

var init = () => {
  settings = {
    width: parseInt(svg.style('width').replace('px', ''), 10),
    height: parseInt(svg.style('height').replace('px', ''), 10),
    iconSize: 20,
    iconMargin: 15
  }

  settings.middle = settings.width / 2
  settings.nbrPerHeight = Math.round(settings.height / (settings.iconSize + 5))
}

init()

window.addEventListener('resize', init)

var g = d3.select('g')

const format = (value) => {
  if(value < 60) return value;

    const m = Math.floor(value / 60)
    const s = value - (m * 60)

    return `${m}'${s}`
}
const getY = (index) => {
    return index % settings.nbrPerHeight * settings.iconSize + settings.iconMargin;
}

const display = () => {

  scale.selectAll(".icon")
    .data(points)
    .enter()
    .append("image")
    .attr("xlink:href", p => catById[p.categoryId].path)
    .attr("width", settings.iconSize)
    .attr("height", settings.iconSize)
    .attr('x', d => d.currentTime * 10 + settings.middle)
    .attr("y", (d, i) => getY(i))

  d3.selectAll("image").on("mouseover", function(p) {
    d3.select(this).attr('xlink:href', catById[p.categoryId].pathDanger)
    ipcRenderer.send('timeline:icon:mouseover', p)
  });

  d3.selectAll("image").on("mouseout", function(p) {
    d3.select(this).attr('xlink:href', catById[p.categoryId].path)
    ipcRenderer.send('timeline:icon:mouseout', p)
  });

}

ipc.on('editor:video:metadata:response', ((event, args) => {
  video = args.video;
  points = args.points;
  catById = args.catById;

  for(let i = 0; i < video.duration + 10; i+= 10){
    scaleBar.push({
      x1: i * 10 + settings.middle,
      x2: i * 10 + settings.middle,
      y1: 0,
      y2: settings.height - 20,
      value: i
    })
  }

  scaleLength = 10 * video.duration
  scaleDuration = video.duration

  d3.select('svg')
    .append('g')
    .append("line")
    .attr('class', 'origin')
    .attr("x1", settings.middle)
    .attr("x2", settings.middle)
    .attr("y1", 0)
    .attr("y2", settings.height)

  var t = scale.selectAll("line")
    .data(scaleBar)
    .enter()

  t.append("line")
    .attr('class', 'scale')
    .attr("x1", d => d.x1)
    .attr("y1", d => d.y1)
    .attr("x2", d => d.x2)
    .attr("y2", d => d.y2)

  t.append('text').attr('text-rendering', "optimizeLegibility")
    .attr('class', 'scale-text')
    .attr('x', d => d.x1 - 2)
    .attr("y", d => settings.height - 5)
    .text( (d) => format(d.value))

  display()

}))
ipc.on('editor:playing', (event, args) => {
  const x = video.duration * - 100 / 10

  transition = d3.select('.scale').transition()
    .ease(d3.easeLinear).attr('transform', `translate(${x}, 00)`)
    .duration(video.duration * 1000)
  console.log(transition)
})
ipc.on("editor:stop", _ => {
  scale.interrupt()
})
ipc.on("editor:oncanplay", ((event, args) => {
  console.log(args)
}))
ipc.on("editor:point:add", ((event, args) => {
  points.push(args)
  display()
}))

ipcRenderer.send('editor:video:metadata:request')




//Draw scale




