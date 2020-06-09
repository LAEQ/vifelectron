

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
}

export {Category, CategoryList}
