import "../scss/app.scss"


import { remote, ipcRenderer } from "electron";
import $ from 'jquery'
import * as slider from 'bootstrap-slider'

const app = remote.app;
const ipc = remote.ipcMain

var rate = $("#rate").slider( {precision: 2, min: 0.1, max: 5, value: 1, step: 0.1});
var duration = $("#duration").slider( {precision: 2, min: 1, max: 10, value: 5, step: 1, lock_to_ticks: true});
var size = $("#size").slider( {precision: 2, min: 40, max: 100, value: 80, step: 5, lock_to_ticks: true});
var opacity = $("#opacity").slider( {precision: 2, min: 0.1, max: 1, value: 0.5, step: 0.1});


rate.on('slide', ev => {
  document.getElementById('rate-info').innerHTML = ev.value
  ipcRenderer.send("controls:rate", ev.value)
})

duration.on('slide', ev => {
  document.getElementById('duration-info').innerHTML = ev.value
})

size.on('slide', ev => {
  document.getElementById('size-info').innerHTML = ev.value
})

opacity.on('slide', ev => {
  document.getElementById('opacity-info').innerHTML = ev.value
})
