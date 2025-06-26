const webpack = require('webpack')
const { inDev } = require('./helpers')
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin')
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin')
const WebpackBarPlugin = require('webpackbar')

module.exports = [
  new ForkTsCheckerWebpackPlugin(),
  // @ts-ignore
  new WebpackBarPlugin(),
  inDev() && new webpack.HotModuleReplacementPlugin(),
  inDev() && new ReactRefreshWebpackPlugin(),
  new MonacoWebpackPlugin({
    languages: ['json', 'graphql'],
    publicPath: '/',
    customLanguages: [
      // @ts-ignore
      {
        label: 'graphql',
        worker: {
          id: 'graphql',
          entry: require.resolve('monaco-graphql/esm/graphql.worker.js'),
        },
      },
    ],
  }),
  ,
  new HtmlWebpackPlugin({
    template: 'public/index.html',
    inject: true,
  }),
  new MiniCssExtractPlugin({
    filename: '[name].[chunkhash].css',
    chunkFilename: '[name].[chunkhash].chunk.css',
  }),
  new webpack.DefinePlugin({
    PRODUCTION: !inDev(),
  }),
].filter(Boolean)
