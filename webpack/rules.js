const { inDev } = require("./helpers");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = [
  {
    test: /\.(js|jsx|ts|tsx)$/,
    exclude: /node_modules/,
    use: [
      {
        loader: require.resolve("babel-loader"),
        options: {
          plugins: [inDev() && require.resolve("react-refresh/babel")].filter(
            Boolean
          ),
        },
      },
    ],
  },
  {
    // CSS Loader
    test: /\.css$/,
    use: [
      { loader: inDev() ? "style-loader" : MiniCssExtractPlugin.loader },
      { loader: "css-loader" },
      {
        loader: "postcss-loader",
      },
    ],
  },
  {
    // Assets loader
    // More information here https://webpack.js.org/guides/asset-modules/
    test: /\.(gif|jpe?g|tiff|png|webp|bmp|svg|eot|ttf|woff|woff2)$/i,
    type: "asset",
    generator: {
      filename: "assets/[hash][ext][query]",
    },
  },
];
