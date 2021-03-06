const path = require('path');
const webpack = require('webpack');
const autoprefixer = require('autoprefixer');
const precss = require('precss');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const product = process.env.product;
const title = process.env.title;

module.exports = {
  entry: {
    app: path.join(__dirname, '../' + product + '/src/index'),
    i18n: path.join(__dirname, '../' + product + '/src/i18n/index')
  },
  output: {
    path: path.join(__dirname, '/../dist/' + product),
    filename: '[name].js'
  },
  cache: false,
  devtool: false,
  plugins: [
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin(),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.AggressiveMergingPlugin(),
    new webpack.DefinePlugin({
      'process.env': { NODE_ENV: JSON.stringify('production') },
      __DEVELOPMENT__: false
    }),
    new webpack.NoErrorsPlugin(),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      title: title,
      hash: true,
      template: './' + product + '/src/index.html',
      excludeChunks: ['i18n']
    })
  ],
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  postcss() {
    return [precss, autoprefixer];
  },
  module: {
    loaders: [
      {
        test: /\.s?css$/,
        loaders: ['style', 'css', 'postcss', 'sass']
      },
      {
        test: /\.jsx?$/,
        loaders: ['babel'],
        exclude: /node_modules/
      },
      {
        test: /\.(png|jpg|svg|gif|woff|woff2)$/,
        loaders: ['url?limit=8192'],
        exclude: /node_modules/
      },
      {
        test: /\.yml$/,
        loader: "file?name=[name].json&context=./i18n/!yaml",
      }
    ]
  },
};
