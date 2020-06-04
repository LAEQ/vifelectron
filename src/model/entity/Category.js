class Category{
  constructor(obj) {
    this.id = obj.id
    this.name = obj.name
    this.pathDefault = obj.pathDefault
    this.pathPrimary = obj.pathPrimary
    this.pathDanger = obj.pathDanger
    this.shortcut = obj.shortcut
  }
}

class Collection {
  constructor() {

  }
}

export {Category}
