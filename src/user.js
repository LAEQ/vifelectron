import './scss/category.scss'

import { remote } from "electron";
import jetpack from "fs-jetpack";
import $ from 'jquery'
import dt from 'datatables'

import Repository from "./model/Repository";
import {UserList} from "./model/entity/User";
const repo = new Repository();

const dialog = remote.dialog
const d = dt()
let table, userList


repo.fetchUsers().then(users => {
  userList = new UserList(users)
  table = $('#table').DataTable({
    "data": userList.users,
    "columns": [
      { "data": "id", title: "id"},
      { "data": "name", title: "name"},
      { "data": "default", title: "default" },
      { "data": null, title: "Action"}
    ],
    "columnDefs": [
      {"targets": -2, render: (data) => {
          if(data === false){
            return "<button class='btn btn-sm btn-outline-info default'>Set as default</button>"
          } else {
            return ""
          }
        }},
      {"targets": -1, "data": null, "defaultContent": "<button class='btn btn-sm btn-outline-danger delete'>Delete</button>"},
    ]
  });

  $('#table tbody').on( 'click', 'button', function () {
    var data = table.row($(this).parents('tr')).data();

    if($(this).hasClass('default')){
      console.log("set as default")
      const table = $('#table').DataTable();
      userList.setAsDefault(data)
      repo.save(userList.users, 'user.json')
      table.clear().rows.add(userList.users).draw();
      return
    }

    if(data.default === true){
      dialog.showErrorBox('Operation not permitted', 'You cannot delete the default user')
      return
    }

    let response = dialog.showMessageBoxSync(remote.getCurrentWindow(), {
      buttons: ["NO", "YES"],
      message: `Are you sure you want to delete the user: ${data.name}`
    })

    if(response === 1){
      userList.delete(data)

      repo.save(userList.users, "user.json")
      table.row($(this).parents('tr')).remove().draw();
    }
  });
})

document.getElementById("reset").addEventListener('click', ev => {
  ev.preventDefault()

  $(`#name`).removeClass('is-invalid')
  $('#name-error').addClass('d-none')

  var form = document.forms['create']
  form[0].value = ""
})

document.querySelector("form").addEventListener("submit", ev => {
  ev.preventDefault()

  var valid = true
  var form = document.forms['create']

  const name = form[0].value
  console.log(name)

  if(userList.isUnique(name) === false){
    $(`#name`).addClass('is-invalid')
    $('#name-error').removeClass('d-none')
    valid = false;
  } else {
    $(`#name`).removeClass('is-invalid')
    $('#name-error').addClass('d-none')
  }

  if(valid){
    console.log("create user")
    const user = repo.createUser(form)

    userList.add(user)

    repo.save(userList.users, "user.json")
    table.clear().rows.add(userList.users).draw();

    $('#reset').click()
  }
});
