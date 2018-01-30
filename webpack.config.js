const path = require('path');
const webpack = require('webpack');
const PROD = process.env.NODE_ENV === 'production';



const adminConfiguration = {
    entry: {
        app: './client/admin/src/app.js',
        vendor: ['axios', 'prosemirror-model', 'prosemirror-schema-basic', 'prosemirror-state', 'prosemirror-view']
    },
    module: {
        loaders: [{
            test: path.join(__dirname, '/client', '/admin', '/src'),
            loader: 'babel-loader'
        }]
    },
    output: {
        filename: '[name].admin.js',
        path: path.join(__dirname, '/client', '/admin', '/build')
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

const blogConfiguration = {
    entry: {
        app: './client/blog/src/index.js',
        vendor: ['axios', 'prosemirror-model', 'prosemirror-schema-basic', 'prosemirror-state', 'prosemirror-view']
    },
    module: {
        loaders: [{
            test: path.join(__dirname, '/client', '/blog', '/src'),
            loader: 'babel-loader'
        }]
    },
    output: {
        filename: '[name].blog.js',
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

module.exports = [blogConfiguration, adminConfiguration];
