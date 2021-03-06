const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const autoprefixer = require('autoprefixer');
const precss = require('precss');
const product = process.env.product;

module.exports = {
  devtool: ['source-map'],
  debug: true,
  entry: {
    app: [
      'webpack-dev-server/client?http://localhost:8000',
      'webpack/hot/only-dev-server',
      './' + product + '/src/index',
    ],
    i18n: './' + product + '/src/i18n/index'
  },
  output: {
    path: path.join(__dirname, '../dist/' + product + '/assets'),
    filename: '[name]-[hash].js',
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development'),
      __DEVELOPMENT__: true
    }),
    new webpack.NoErrorsPlugin(),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, '../' + product + '/src/index.html'),
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
        loaders: ['react-hot', 'babel'],
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
