const webpack = require('webpack');
const merge = require('webpack-merge');
const webConfig = require('./webpack.config.web');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const config = require('../config');

module.exports = merge.smart(webConfig, {
    entry: {hmr: 'webpack-hot-middleware/client'},
    module: {loaders: [
        {
            test: /\.jsx$/,
            loaders: ['react-hot'],
            exclude: /node_modules/
        }
    ]},
    plugins: [
        webConfig.plugins.slice(0, webConfig.plugins.length - 1),
        new webpack.HotModuleReplacementPlugin(),
        webConfig.plugins[webConfig.plugins.length - 1]
    ]
});
