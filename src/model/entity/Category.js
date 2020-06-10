

class Category{
  constructor(obj) {
    this.id = obj.id
    this.name = obj.name
    this.pathDefault = obj.pathDefault
    this.pathPrimary = obj.pathPrimary
    this.pathAlert = obj.pathAlert
    this.shortcut = obj.shortcut
  }
}

class CategoryList{
  constructor(categories) {
    this.categories = categories
    this.keys = categories.map( c => c.shortcut)
    this.mapKey = new Map()
    this.mapId = new Map()

    categories.forEach(c => {
      this.mapId.set(c.id, c)
      this.mapKey.set(c.shortcut, c)
    })
  }

  getId(id){
    return this.mapId.get(id);
  }

  getKey(key){
    return this.mapKey.get(key);
  }

  getRandom(){
    for(let i = this.keys.length - 1; i > 0; i--){
      const j = Math.floor(Math.random() * i)
      const temp = this.keys[i]
      this.keys[i] = this.keys[j]
      this.keys[j] = temp
    }

    return this.keys[0]
  }

  increment(id){
    this.mapId.get(id).total++
  }

  decrement(id){
    this.mapId.get(id).total--
  }
}

export {Category, CategoryList}
