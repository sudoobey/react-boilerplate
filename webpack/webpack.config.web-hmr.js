const merge = require('webpack-merge');
const webConfig = require('./webpack.config.web');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const config = require('../config');

module.exports = merge(webConfig, {
    plugins: [
        ...webConfig.commonPlugins,
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
