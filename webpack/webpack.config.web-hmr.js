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
            happy: {id: 'jsx-web'},
            exclude: /node_modules/
        }
    ]},
    plugins: [
        ...webConfig.commonPlugins,
        new webpack.HotModuleReplacementPlugin(),
        new HtmlWebpackPlugin({
            template: config.INDEX_TMPL,
            minify: {
                removeAttributeQuotes: true,
                minifyJS: true,
                html5: true,
                collapseWhitespace: true,
                removeStyleLinkTypeAttributes: true,
                removeScriptTypeAttributes: true
            }
        })
    ]
});
