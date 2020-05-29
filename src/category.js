import "./scss/app.scss"

import { remote, ipcRenderer } from "electron";
import jetpack from "fs-jetpack";
import path from 'path';
import $ from 'jquery'
import dt from 'datatables'

import Repository from "./model/Repository";
import Settings from "./helpers/initialize";

const app = remote.app;
const appDir = jetpack.cwd(app.getAppPath());
const settings = new Settings();
const manifest = appDir.read("package.json", "json");
const d = dt()

const getFile = _ =>{
  const file = document.getElementById('file').files[0]

  return file
}

const getName = _ => {
  return document.getElementById('name').value
}


let previewImage = document.getElementById("preview")

document.getElementById('file').addEventListener('change', ev => {
  const file = getFile()
  if(file){
    previewImage.src = file.path
    previewImage.width = 100
  } else {
    previewImage.src = null
    previewImage.width = 0
  }
})

document.querySelector("form").addEventListener("submit", _ => {
  event.preventDefault()
  const file = getFile()
  const name = getName()

  if(file){

    alert("add validation file exist, category name exists, ...")

    var form = document.getElementById('form-create');
    var data = new FormData(form);

    const category = repository.createCategory(data)
    categories.push(category)

    repository.save(categories, 'category.json')
    var t = $('#table').DataTable();

    t.row.add(category).draw(false)
  }

})

const repository = new Repository()
let categories, table

repository.fetchCategory().then(result => {
  categories = result
  table = $('#table').DataTable({
    "data": categories,
    "columns": [
      { "data": "path", title: "icon"},
      { "data": "id", title: "id" },
      { "data": "name", title: "name"},
      { "data": "path", title: "file"},
      { "data": null},
      { "data": null}
    ],
    "columnDefs": [
      {targets: 0, render: function(data) {
        const src = path.join(settings.icon, data)
        return `<img src="${src}" width="100" />`
      }},
      {"targets": -2, "data": null, "defaultContent": "<button class='btn btn-sm btn-outline-danger delete'>Delete</button>"},
      {"targets": -1, "data": null, "defaultContent": "<button class='btn btn-sm btn-outline-primary'>Edit</button>"}
    ]
  });
  $('#table tbody').on( 'click', 'button', function () {
    var data = table.row( $(this).parents('tr') ).data();

    categories = categories.filter(c => c.id != data.id)
    jetpack.removeAsync(path.join(settings.icon, data.path))
    repository.save(categories, "category.json")
    table.row($(this).parents('tr')).remove().draw();

  });
})

