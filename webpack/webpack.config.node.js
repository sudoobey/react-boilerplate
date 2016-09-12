const webpack = require('webpack');
const merge = require('webpack-merge');
const basicConfig = require('./get-basic-config')('node');
const config = require('../config');

module.exports = merge(basicConfig, {
    entry: {'node-main': './view/entry-node.js'},
    target: 'node',
    output: {
        path: config.OUTPUT_DIR_NODE,
        filename: config.NODE_BUNDLE_FILENAME,
        libraryTarget: 'commonjs2'
    },
    module: {loaders: [
        {test: /\.(js|jsx)$/,
            loader: 'babel',
            query: {
                plugins: [
                    ['css-modules-transform', {
                        generateScopedName: config.STYLE_NAME_TEMPLATE,
                        extensions: ['.css']
                    }]
                ]
            }
        }
    ]},
    plugins: [
        new webpack.optimize.LimitChunkCountPlugin({maxChunks: 1})
    ]
});
