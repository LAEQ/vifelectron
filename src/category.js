import "./scss/category.scss"

import { remote } from "electron";
import jetpack from "fs-jetpack";
import $ from 'jquery'
import dt from 'datatables'

import Repository from "./model/Repository";
import Settings from "./helpers/initialize";

const app = remote.app;
const appDir = jetpack.cwd(app.getAppPath());
const settings = new Settings();
const manifest = appDir.read("package.json", "json");
const d = dt()
const BrowserWindow = remote.BrowserWindow
const dialog = remote.dialog

const listenFile = (id) => {
  const fileInput = document.getElementById(id)

  fileInput.addEventListener('change', ev => {
    const file = fileInput.files[0]
    if(file){
      const previewImg = document.getElementById(`${id}Preview`)
      previewImg.src = file.path
    }
  })
}

let fileIds = ['default', 'primary', 'danger']

fileIds.forEach(f => listenFile(f))

const validate = () => {
  let valid = true
  var form = document.forms['create']

  //Name
  let name = form[0].value

  let c = categories.find(c => c.name === name)

  if(c !== undefined){
    $('#name').addClass('is-invalid')
    $('#name-invalid-msg').removeClass('d-none')
    valid = valid && false
  } else {
    $('#name').removeClass('is-invalid')
    $('#name-invalid-msg').addClass('d-none')
    valid = valid && true
  }

  let shortcut = form[1].value
  c = categories.find(c => c.shortcut === shortcut)
  if(shortcut.length != 1 || c !== undefined){
    $('#shortcut').addClass('is-invalid')
    $('#shortcut-invalid-msg').removeClass('d-none')
    valid = valid && false
  }

  return valid
}

document.querySelector("form").addEventListener("submit", _ => {
  event.preventDefault()

  if(validate()){
    var form = document.forms['create']
    var data = new FormData(form);

    const category = repository.createCategory(data)
    categories.push(category)

    repository.save(categories, 'category.json')
    $('#table').DataTable().row.add(category).draw(false)
  }
})

const repository = new Repository()
let categories, table

repository.fetchCategory().then(result => {
  categories = result
  console.log(result)
  table = $('#table').DataTable({
    "data": categories,
    "columns": [
      { "data": "pathDefault", title: "icon"},
      { "data": "name", title: "name"},
      { "data": "shortcut", title: "shortcut" },
      { "data": null},
      { "data": null}
    ],
    "columnDefs": [
      {targets: 0, render: function(data) {
        return `<img src="${data}" width="60" />`
      }},
      {"targets": -2, "data": null, "defaultContent": "<button class='btn btn-sm btn-outline-danger delete'>Delete</button>"},
      {"targets": -1, "data": null, "defaultContent": "<button class='btn btn-sm btn-outline-primary edit'>Edit</button>"}
    ]
  });
  $('#table tbody').on( 'click', 'button', function () {
    var data = table.row( $(this).parents('tr') ).data();

    if($(this).hasClass('delete')){
      let response = dialog.showMessageBoxSync(remote.getCurrentWindow(), {
        buttons: ["NO", "YES"],
        message: `Are you sure you want to delete the category: ${data.name}`
      })

      if(response === 1){
        categories = categories.filter(c => c.id != data.id)
        repository.save(categories, "category.json")
        table.row($(this).parents('tr')).remove().draw();

        jetpack.removeAsync(data.pathDefault)
        jetpack.removeAsync(data.pathPrimary)
        jetpack.removeAsync(data.pathDanger)
      }
   } else {
      setFormData(data)
    }
  });
})

const setFormData = (data) => {
  var form = document.forms['create']
  form[0]. value = data.name
  form[1].value = data.shortcut
  document.getElementById(`defaultPreview`).src = data.pathDefault
  document.getElementById(`primaryPreview`).src = data.pathPrimary
  document.getElementById(`dangerPreview`).src = data.pathDanger


}
