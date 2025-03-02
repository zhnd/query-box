module.exports = {
  mode: "development",
  entry: {
    app: "./src/main.tsx",
  },
  module: {
    rules: require("./rules"),
  },
  output: {
    filename: "[name].js",
    chunkFilename: "[name].chunk.js",
  },
  plugins: require("./plugins"),
  resolve: {
    extensions: [".js", ".ts", ".jsx", ".tsx", ".css"],
    alias: {
      ...require("./aliases"),
    },
  },
  stats: "errors-warnings",
  devtool: "cheap-module-source-map",
  devServer: {
    port: 3000,
    hot: true,
  },
  optimization: {
    splitChunks: {
      chunks: "all",
    },
  },
  performance: {
    hints: false,
  },
};
