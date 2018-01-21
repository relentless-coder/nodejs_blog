const path = require('path');
const webpack = require('webpack');
const PROD = process.env.NODE_ENV === 'production'

const blogConfiguration = {
  entry: {
    app: './client/blog/index.js',
    vendor: ['axios', 'prosemirror-model', 'prosemirror-schema-basic', 'prosemirror-state']
  },
  module: {
    loaders: [{
      test: path.join(__dirname, '/client', '/blog'),
      loader: 'babel-loader'
    }]
  },
  output: {
    filename: '[name].js',
    path: path.join(__dirname, '/client', '/blog', '/build')
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

module.exports = [blogConfiguration]