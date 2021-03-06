import "./scss/collection.scss"

import { remote } from "electron";
import jetpack from "fs-jetpack";
import $ from 'jquery'
import dt from 'datatables'

import Repository from "./model/Repository";
import Settings from "./helpers/initialize";

const dialog = remote.dialog
const settings = new Settings();
const repo =   new Repository();

const catPromise = repo.fetchCategory();
const colPromise = repo.fetchCollection();
const d = dt()

let categories, collections, table

Promise.all([catPromise, colPromise]).then(values => {
  categories = values[0];
  collections = values[1];

  initTable()
  initForm()
})

const initTable = _ => {
  table = $('#table').DataTable({
    "data": collections,
    "columns": [
      {"data": "id", title: "id"},
      {"data": "name", title: "name"},
      {"data": "default", title: "default"},
      {"data": "categoryIds", title: "List of categories"},
      {"data": "default", title: "Set default"},
      {"data": null, title: "action"}
    ],
    "columnDefs": [
      {"targets": -3, render: (data) => {
          let html = `<div class="d-flex align-content-start flex-wrap">`
          data.forEach(c => {
            const category = categories.find(cat => cat.id == c)
            html += `<div class="card m-2" >
              <img class="card-img-top cat-icon mx-auto" src="${category.pathDefault}" >
              <ul class="list-group list-group-flush">
                <li class="list-group-item">
                    ${category.name}
                </li>
              </ul>
            </div>`
          })

          html += "</div>"

          return html
        }
      },
      {"targets": -2, render: (data) => {
        if(data === false){
          return "<button class='btn btn-sm btn-outline-info default'>Set as default</button>"
        } else {
          return ""
        }
      }},
      {"targets": -1, "data": null, "defaultContent": "<button class='btn btn-sm btn-danger delete'>Delete</button>"},
    ]
  });

  $('#table tbody').on( 'click', 'button', function () {
    var data = table.row( $(this).parents('tr') ).data();

    if($(this).hasClass('default')){
      const table = $('#table').DataTable();
      collections.forEach(col => col.default = col.id === data.id ? true : false)
      repo.save(collections, 'collection.json')

      table.clear().rows.add(collections).draw();
      return
    }

    if(data.default === true){
      dialog.showErrorBox('Operation not permitted', 'You cannot delete the default collection')
      return
    }

    if($(this).hasClass('delete')){
      let response = dialog.showMessageBoxSync(remote.getCurrentWindow(), {
        buttons: ["NO", "YES"],
        message: `Are you sure you want to delete the category: ${data.name}`
      })

      if(response === 1){
        const colFiltered = collections.filter(c => c.id != data.id)
        collections = colFiltered
        repo.save(collections, "collection.json")
        table.row($(this).parents('tr')).remove().draw();
      }
    }
  });
}
const initForm = _ => {
  let html = `<div class="d-flex align-content-start flex-wrap">`

  categories.forEach(c => {
    html += `<div class="card m-2 cat-click" data-id="${c.id}">
              <img class="card-img-top cat-icon mx-auto" src="${c.pathDefault}" >
              <ul class="list-group list-group-flush">
                <li class="list-group-item">
                    ${c.name}
                </li>
              </ul>
            </div>`
  })

  html += `</div>`

  document.getElementById('form-category-list').innerHTML = html

  $('.cat-click').on('click', ev => {
    const target = $(ev.currentTarget)
    target.toggleClass('alert alert-primary')
    const catId = $(ev.currentTarget).data('id')
    const value = document.getElementById('categories').value
    let result = value.length === 0 ? [] : value.split(";")

    if(target.hasClass("alert-primary")){
      result.push(catId)
      document.getElementById('categories').value  = result.join(";")
    } else {
      document.getElementById('categories').value = result.filter( r => r != catId).join(";")
    }
  });
}

document.querySelector("form").addEventListener("submit", ev => {
  ev.preventDefault()

  var valid = true
  var form = document.forms['create']

  const name = form[0].value
  const col = collections.find(c => c.name === name)

  if(col !== undefined){
    $(`#name`).addClass('is-invalid')
    $('#name-error').removeClass('d-none')
    valid = false;
  } else {
    $(`#name`).removeClass('is-invalid')
    $('#name-error').addClass('d-none')
  }

  if(form[1].value.length === 0){
    $('#categories-error').removeClass('d-none')
    valid = false
  } else {
    $('#categories-error').addClass('d-none')
  }

  if(valid){
    const newCol = repo.createCollection(form)

    // if(newCol.default === true){
    //   collections.forEach(c => c.default = false)
    // }

    collections.push(newCol)

    $('#reset').click()
    $('.cat-click').removeClass('alert alert-primary')

    repo.save(collections, 'collection.json')
    table.clear().rows.add(collections).draw();
  }
});

