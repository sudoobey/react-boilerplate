'use strict';
const IS_PROD = process.env.NODE_ENV !== 'development';
const webpack = require('webpack');
const merge = require('webpack-merge');
const basicConfig = require('./get-basic-config')();

const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const config = require('../config');

let mainCssLoader;

const postCssPlugins = [
    // require('postcss-import'),  // HACK для того, чтобы работали custom-properties
    require('postcss-custom-properties'),
    require('postcss-calc'),
    require('autoprefixer')
];

const cssLoaders = [
    {
        loader: 'css-loader',
        options: {
            modules: true,
            importLoaders: 1,
            minimize: IS_PROD, sourceMap: IS_PROD,
            localIdentName: config.STYLE_NAME_TEMPLATE
        }
    },
    {
        loader: 'postcss-loader',
        options: {plugins: postCssPlugins}
    }
];

if (IS_PROD) {
    mainCssLoader = ExtractTextPlugin.extract({
        fallbackLoader: 'style-loader?sourceMap',
        loader: cssLoaders
    });
} else {
    mainCssLoader = ['style-loader', ...cssLoaders];
}

const commonPlugins = [
    new ExtractTextPlugin({
        filename: `${config.FILENAME_TEMPLATE}.css`,
        allChunks: false
    }),
    new webpack.optimize.CommonsChunkPlugin({
        name: 'vendor',
        minChunks: (module) =>
            /node_modules/.test(module.resource)
    })
];

module.exports = merge.smart(basicConfig, {
    entry: {main: './view/entry-web.jsx'},
    output: {
        path: config.OUTPUT_DIR_WEB
    },
    plugins: [
        ...commonPlugins,
        new HtmlWebpackPlugin({
            template: config.INDEX_TMPL,
            filename: config.INDEX_TMPL_FILENAME,
            minify: {
                html5: true,
                minifyJS: IS_PROD,
                collapseWhitespace: IS_PROD,
                removeAttributeQuotes: IS_PROD,
                removeStyleLinkTypeAttributes: IS_PROD,
                removeScriptTypeAttributes: IS_PROD
            }
        })
    ],
    module: {
        loaders: [
            {
                test: /\.css$/,
                loader: mainCssLoader
            }
        ]
    },
    resolve: {
        alias: IS_PROD ? {
            'react': 'react-lite',
            'react-dom': 'react-lite'
        } : {}
    }
});
