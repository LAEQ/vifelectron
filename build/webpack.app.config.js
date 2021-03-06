const path = require("path");
const merge = require("webpack-merge");
const base = require("./webpack.base.config");

module.exports = env => {
  return merge(base(env), {
    entry: {
      background: "./src/background.js",
      app: "./src/app.js",
      user: "./src/user.js",
      category: "./src/category.js",
      collection: "./src/collection.js",
      editor: "./src/editor.js",
      tool: "./src/tool.js",
      controls: "./src/javascript/controls.js",
      timeline: "./src/timeline.js",
      statistic_video: "./src/statistic_video.js",
      visualize: "./src/visualize.js"
    },
    output: {
      filename: "[name].js",
      path: path.resolve(__dirname, "../app")
    }
  });
};
