
export function Graph(vertices){
  this.vertices = vertices || [];
}

export function Vertex(name){
  this.name = name || null;
  this.connections = [];

  // used in tarjan algorithm
  // went ahead and explicity initalized them
  this.index= -1;
  this.lowlink = -1;
}

Vertex.prototype = {
  equals: function(vertex){
    // equality check based on vertex name
    return (vertex.name && this.name==vertex.name);
  }
};

export function VertexPoint(point){
  this.point = point || null;
  this.connections = [];
  this.index= -1;
  this.lowlink = -1;
}

VertexPoint.prototype = {
  equals: function(vertex){
    return (vertex.point && this.point.id === vertex.point.id)
  },
  match: function(vertex, step = 5) {
    return vertex.point.categoryId === this.point.categoryId
      && Math.abs(vertex.point.currentTime - this.point.currentTime) <= step
  }
}

export function VertexStack(vertices) {
  this.vertices = vertices || [];
}
VertexStack.prototype = {
  contains: function(vertex){
    for (var i in this.vertices){
      if (this.vertices[i].equals(vertex)){
        return true;
      }
    }
    return false;
  }
};

export function Tarjan(graph) {
  this.index = 0;
  this.stack = new VertexStack();
  this.graph = graph;
  this.scc = [];
}
Tarjan.prototype = {
  run: function(){
    for (var i in this.graph.vertices){
      if (this.graph.vertices[i].index<0){
        this.strongconnect(this.graph.vertices[i]);
      }
    }
    return this.scc;
  },
  strongconnect: function(vertex){
    // Set the depth index for v to the smallest unused index
    vertex.index = this.index;
    vertex.lowlink = this.index;
    this.index = this.index + 1;
    this.stack.vertices.push(vertex);

    // Consider successors of v
    // aka... consider each vertex in vertex.connections
    for (var i in vertex.connections){
      var v = vertex;
      var w = vertex.connections[i];
      if (w.index<0){
        // Successor w has not yet been visited; recurse on it
        this.strongconnect(w);
        v.lowlink = Math.min(v.lowlink,w.lowlink);
      } else if (this.stack.contains(w)){
        // Successor w is in stack S and hence in the current SCC
        v.lowlink = Math.min(v.lowlink,w.index);
      }
    }

    // If v is a root node, pop the stack and generate an SCC
    if (vertex.lowlink==vertex.index){
      // start a new strongly connected component
      var vertices = [];
      var w = null;
      if (this.stack.vertices.length>0){
        do {
          w = this.stack.vertices.pop();
          // add w to current strongly connected component
          vertices.push(w);
        } while (!vertex.equals(w));
      }
      // output the current strongly connected component
      // ... i'm going to push the results to a member scc array variable
      if (vertices.length>0){
        this.scc.push(vertices);
      }
    }
  }
};

export class Statistic{
  constructor(ids, catIds, pointList1, pointList2) {
    this.ids = ids
    this.catIds = catIds
    this.p1 = pointList1
    this.p2 = pointList2
  }

  connect(step = 5){
    let result = 0

    this.v1 = this.p1.vertices()
    this.v2 = this.p2.vertices()

    for(let i = 0; i< this.v1.length; i++){
      const v1 = this.v1[i]
      for(let j = 0; j < this.v2.length; j++){
        const v2 = this.v2[j]

        if(v1.match(v2, step)){
          result++
          v1.connections.push(v2)
        }
      }
    }

    for(let i = 0; i< this.v2.length; i++){
      const v2 = this.v2[i]
      for(let j = 0; j < this.v1.length; j++){
        const v1 = this.v1[j]

        if(v2.match(v1, step)){
          result++
          v2.connections.push(v1)
        }
      }
    }

    return result
  }

  tarjan(step = 5){
      const vertices = this.v1.concat(this.v2)

      const graph = new Graph(vertices);
      const tarjan = new Tarjan(graph);

      this.scc = tarjan.run();

      return this.scc
  }

  groupByVideo(array) {
    return array.reduce((objectsByKeyValue, obj) => {
      const value = obj['videoId'];
      objectsByKeyValue[value] = (objectsByKeyValue[value] || []).concat(obj);
      return objectsByKeyValue;
    }, {});
  }

  countGroup(obj) {
    let min = Number.MAX_SAFE_INTEGER, keys = Object.keys(obj)
    const result = keys.reduce((result, id) => {
      const total = obj[id].length
      result[id] = total;
      min = Math.min(min, total)
      return result
    }, {'both': 0})

    if(keys.length > 1){
      keys.forEach(k => {
        result[k] -= min
      })

      result['both'] = min
    }

    return result
  }

  statByCategory(){

    let result = new Map()
    this.catIds.forEach(id => {
      result.set(id, this.ids.reduce((result, id) => {
        result[id] = 0
        return result
      }, {'both': 0}))
    })


    this.scc.forEach(s => {
      const catId = s[0].point.categoryId
      const groups = this.groupByVideo(s.map( t => t.point))
      const count = this.countGroup(groups)
      Object.keys(count).forEach(k => {
        result.get(catId)[k] += count[k]
      })
    })

    return result
  }
}
