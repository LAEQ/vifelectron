import { expect } from "chai";
import {Vertex, Graph, Tarjan, Statistic} from "./statistic";
import {v4 as uuidv4} from "uuid";
import {Video} from "../model/entity/Video";
import {PointList} from "../model/entity/Point";

const createPointList = (videoId, values) => {
  return new PointList(values.map(v => {
    return {id: uuidv4(), videoId: videoId.id, categoryId: v[0], currentTime: v[1]}
  }));
}

describe("Tarjan algorithm", () => {
  it("test tarjan with vertex named", () => {
    var v0 = new Vertex("0");
    var v1 = new Vertex("1");
    var v2 = new Vertex("2");
    var v3 = new Vertex("3");
    var v4 = new Vertex("4");
    var v5 = new Vertex("5");
    var v6 = new Vertex("6");
    var v7 = new Vertex("7");
    var v8 = new Vertex("8");
    var v9 = new Vertex("9");
    var v10 = new Vertex("10");
    var v11 = new Vertex("11");
    var v12 = new Vertex("12");

    v0.connections.push(v1);
    v0.connections.push(v5);
    v2.connections.push(v0);
    v2.connections.push(v3);
    v3.connections.push(v2);
    v3.connections.push(v5);
    v4.connections.push(v2);
    v4.connections.push(v2);
    v5.connections.push(v4);
    v6.connections.push(v0);
    v6.connections.push(v9);
    v7.connections.push(v6);
    v7.connections.push(v8);
    v8.connections.push(v7);
    v8.connections.push(v9);
    v9.connections.push(v10);
    v9.connections.push(v11);
    v10.connections.push(v12);
    v11.connections.push(v4);
    v11.connections.push(v12);
    v12.connections.push(v9);

    var vertices = [v0,v1,v2,v3,v4,v5,v6,v7,v8,v9,v10,v11,v12]

    var graph = new Graph(vertices);
    var tarjan = new Tarjan(graph);

    var scc = tarjan.run();

    expect(scc.length).to.equals(5)
    expect(scc[0].map(v => v.name).sort()).to.eql(["1"])
    expect(scc[1].map(v => v.name).sort()).to.eql(["0","2","3","4","5"])
    expect(scc[2].map(v => v.name).sort()).to.eql(["10","11","12","9"])
    expect(scc[3].map(v => v.name).sort()).to.eql(["6"])
    expect(scc[4].map(v => v.name).sort()).to.eql(["7","8"])
  });

});

describe("Statistic", () => {
  it("test connect with multiple steps", () => {
    const video1 = new Video({
      id: uuidv4(),
      name: "video1",
      collection: {},
    });

    const video2 = new Video({
      id: uuidv4(),
      name: "video1",
      collection: {},
    });

    // const point1 = [[1, 1], [1,5], [1,10], [2,1], [2,5], [2, 10]]
    // const point2 = [[1, 1], [1,6], [1,12], [2,3], [2,5], [2, 12]]
    const point1 = [[1, 1], [1,5], [1, 12]]
    const point2 = [[1, 1], [1,6]]
    const p1 = createPointList(video1, point1)
    const p2 = createPointList(video2, point2)

    const statistic = new Statistic([video1.id, video2.id], [1], p1, p2)
    let result = statistic.connect()
    expect(result).to.equal(8)

    result = statistic.connect(2)
    expect(result).to.equal(4)

    result = statistic.connect(0)
    expect(result).to.equal(2)
  });

  it("test tarjan with multiple steps", () => {
    const video1 = new Video({
      id: uuidv4(),
      name: "video1",
      collection: {},
    });

    const video2 = new Video({
      id: uuidv4(),
      name: "video1",
      collection: {},
    });

    // const point1 = [[1, 1], [1,5], [1,10], [2,1], [2,5], [2, 10]]
    // const point2 = [[1, 1], [1,6], [1,12], [2,3], [2,5], [2, 12]]
    const point1 = [[1, 1], [1,5], [1, 12], [2,1]]
    const point2 = [[1, 1], [1,6], [2,10]]
    const p1 = createPointList(video1, point1)
    const p2 = createPointList(video2, point2)

    const statistic = new Statistic([video1.id, video2.id], [1,2], p1, p2)
    statistic.connect()
    let result = statistic.tarjan()
    expect(result.length).to.equals(4)

    statistic.connect(1)
    result = statistic.tarjan()
    expect(result.length).to.equals(5)
  });

  it("test run", () => {
    const video1 = new Video({
      id: uuidv4(),
      name: "video1",
      collection: {},
    });

    const video2 = new Video({
      id: uuidv4(),
      name: "video1",
      collection: {},
    });

    // const point1 = [[1, 1], [1,5], [1,10], [2,1], [2,5], [2, 10]]
    // const point2 = [[1, 1], [1,6], [1,12], [2,3], [2,5], [2, 12]]
    const point1 = [[1, 1], [1,5], [1, 12], [2,1]]
    const point2 = [[1, 1], [1,6], [2,10]]
    const p1 = createPointList(video1, point1)
    const p2 = createPointList(video2, point2)

    const statistic = new Statistic([video1.id, video2.id], [1,2], p1, p2)
    statistic.connect(5)
    const result = statistic.statByCategory([1,2])

    expect(result.size).to.equals(2)
    expect(result.get(1)[video1.id]).to.equals(1)
    expect(result.get(1)[video2.id]).to.equals(0)
    expect(result.get(1)['both']).to.equals(2)
    expect(result.get(2)[video1.id]).to.equals(1)
    expect(result.get(2)[video2.id]).to.equals(1)
    expect(result.get(2)['both']).to.equals(0)

  });
})
