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

  const input = fileComponents[id].input
  input.addEventListener('change', _ => {
    const file = fileComponents[id].input.files[0]
    if(file){
      fileComponents[id].preview.src = file.path
      fileComponents[id].label.innerHTML = file.name
      $(fileComponents[id].preview).removeClass('d-none')
      $(fileComponents[id].svg).addClass('d-none')
    }
  })
}

let fileIds = ['default', 'primary', 'alert'];
let fileComponents = {};
fileIds.forEach(id => {
  fileComponents[id] = {}
  fileComponents[id].input = document.getElementById(id)
  fileComponents[id].label = document.getElementById(`${id}-label`)
  fileComponents[id].preview = document.getElementById(`${id}-preview`)
  fileComponents[id].svg = document.getElementById(`${id}-svg`)

  listenFile(id)
});

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
};

document.querySelector("form").addEventListener("submit", _ => {
  event.preventDefault()

  if(validate()){
    var form = document.forms['create']

    const category = repository.createCategory(form)
    categories.push(category)

    repository.save(categories, 'category.json')
    $('#table').DataTable().row.add(category).draw(false)
    table.reload();

    document.getElementById('reset').click()
  }
});

const repository = new Repository();
let categories, table;

repository.fetchCategory().then(result => {
  categories = result
  table = $('#table').DataTable({
    "data": categories,
    "columns": [
      { "data": "pathDefault", title: "icon"},
      { "data": "name", title: "name"},
      { "data": "shortcut", title: "shortcut" },
      { "data": null, title: "Action"}
    ],
    "columnDefs": [
      {targets: 0, render: function(data) {
        return `<img src="${data}" width="60" />`
      }},
      {"targets": -1, "data": null, "defaultContent": "<button class='btn btn-sm btn-outline-danger delete'>Delete</button>"},
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
        table.reload();
      }
   }
  });
})


