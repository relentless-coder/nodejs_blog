const path = require('path');
const webpack = require('webpack');
const PROD = process.env.NODE_ENV === 'production'

const configuration = {
  entry: {
    app: './client/index.js',
    vendor: ['axios']
  },
  module: {
    loaders: [{
      test: path.join(__dirname, '/client'),
      loader: 'babel-loader'
    }]
  },
  output: {
    filename: '[name].js',
    path: path.join(__dirname, '/client', '/build')
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor'
    }),
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery'
    }),
  ]
};

module.exports = configuration