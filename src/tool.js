import './scss/app.scss'

import { remote, ipcRenderer } from "electron";
import jetpack from "fs-jetpack";
import path from 'path';
import Settings from "./helpers/initialize";
import Repository from "./model/Repository";
import ffmpeg from "fluent-ffmpeg";

import {Video} from "./model/entity/Video";

const app = remote.app;
const ipc = remote.ipcMain
const appDir = jetpack.cwd(app.getAppPath());
const settings = new Settings();
const repository = new Repository();

const videoId = global.location.search.split("=")[1]
const video = repository.fetchVideo(videoId)

document.getElementById('title').innerHTML = video.name

var form = {
  'width': document.getElementById('width'),
  'frames': document.getElementById('frames'),
  'FPS': document.getElementById("FPS")
}

const showVideoDetail = (metadata) => {
  const imgContainer = document.getElementById('img-container')
  const fileContainer = document.getElementById('file-container')
  const audioContainer = document.getElementById('audio-container')
  const videoContainer = document.getElementById('video-container')

  const imgPath = `${video.id}.png`

  //Img
  imgContainer.innerHTML = `<img class="img-thumbnail" src="${path.join(settings.video, imgPath)}" />`

  let html = ""
  //File keys
  const fileKeys = ['filename', 'format_long_name', 'duration', 'size', 'bit_rate']
  const tagKeys = ['major_brand', 'minor_version', 'encoder']

  fileKeys.forEach(k => {html += `<dt class="col-sm-6">${k}</dt><dd class="col-sm-6">${metadata['format'][k]}</dd>`})
  tagKeys.forEach(k => {html += `<dt class="col-sm-6">${k}</dt><dd class="col-sm-6">${metadata['format']['tags'][k]}</dd>`})
  fileContainer.innerHTML = html

  //Audio keys:
  let audioStream = metadata['streams'][0]
  let videoStream = metadata['streams'][1]
  if(audioStream['codec_type'] === 'video'){
    let tmpVideoStream = audioStream
    audioStream = videoStream
    videoStream = tmpVideoStream
  }

  const audioKeys = ['codec_name', 'profile', 'codec_type', 'codec_time_base', 'codec_tag_string', 'sample_fmt', 'sample_rate', 'channels', 'channel_layout', 'duration_ts', 'bit_rate']

  html = ""
  audioKeys.forEach(k => html += `<dt class="col-sm-6">${k}</dt><dd class="col-sm-6">${audioStream[k]}</dd>`)
  audioContainer.innerHTML = html

  const videoKeys = ['codec_name', 'codec_type', 'width', 'height', 'avg_frame_rate', 'bit_rate', 'bits_per_raw_sample', 'nb_frames']
  html = ""
  videoKeys.forEach(k => html += `<dt class="col-sm-6">${k}</dt><dd class="col-sm-6">${videoStream[k]}</dd>`)
  videoContainer.innerHTML = html

  //Fill the form
  form.width.value = `${videoStream['width']} x ${videoStream['height']}`
  form.frames.value = `${videoStream['nb_frames']}`
  form.FPS.value = `${videoStream['']}`
}

ffmpeg.setFfmpegPath(settings.getFfmpegPath())
ffmpeg.setFfprobePath(settings.getFfprobePath())
ffmpeg.ffprobe(video.path, (err, metadata) =>{
  if(err === null){
    showVideoDetail(metadata)
    console.log(metadata)
  } else {
    console.log(err)
  }
})

var progressBar = document.getElementById('convertion-progress-bar')
progressBar.style.width = "0%"

document.getElementById("convert").addEventListener('click', event =>{
  event.preventDefault()
  const outputPath = path.join(settings.video, "test.avi")

  console.log(video.path, outputPath)

  var proc = new ffmpeg({ source: video.path })
    .withAspect('4:3')
    .withSize('640x480')
    .applyAutopadding(true, 'white')
    .saveToFile(outputPath, function(stdout, stderr) {

    }).on('progress', function (progress) {
      progressBar.style.width = `${progress.percent}%`
      console.log('Processing: ' + progress.percent + '% done');
      progressBar.innerHTML = `${Math.round(progress.percent)} %`
    })
})


