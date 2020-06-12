export class User{
  constructor(obj) {
    console.log(obj)
    this.id = obj.id;
    this.name = obj.name;
    this.default = obj.default;
  }

  isDefault(){
    return this.default;
  }
}

export class UserList{
  constructor(users) {
    this.users = users
  }

  getDefault(){
    return this.users.find(u => u.default)
  }

  add(user){
    this.users.push(user)
  }

  delete(user){
    this.users = this.users.filter(u => u.id !== user.id)
  }

  isUnique(name){
    return this.users.find(u => u.name === name) === undefined
  }

  setAsDefault(user){
    this.users.forEach(u => u.default = u.id === user.id ? true : false);
  }
}
