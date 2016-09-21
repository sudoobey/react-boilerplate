const IS_PROD = process.env.NODE_ENV !== 'development';
const webpack = require('webpack');
const merge = require('webpack-merge');
const configName = 'web';
const basicConfig = require('./get-basic-config')(configName);

const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const config = require('../config');

const cssLoaders = [
    {loader: 'css-loader', query: {
        modules: true, minimize: IS_PROD, sourceMap: IS_PROD,
        localIdentName: config.STYLE_NAME_TEMPLATE
    }},
    {loader: 'postcss-loader'}
];

const postCssPlugins = [
    require('postcss-cssnext')
];

let loaders = [];
if (IS_PROD) {
    loaders.push({
        test: /\.css$/,
        loader: ExtractTextPlugin.extract({
            fallbackLoader: 'style?sourceMap',
            loader: cssLoaders
        })
    });
} else {
    loaders.push({
        test: /\.css$/,
        loaders: ['style-loader', ...cssLoaders],
        happy: {id: `css-dev-${configName}`}
    });
}

let commonPlugins = [
    new ExtractTextPlugin({
        filename: `${config.FILENAME_TEMPLATE}.css`,
        allChunks: false
    }),
    new webpack.optimize.CommonsChunkPlugin({
        name: 'vendor',
        minChunks: module => /node_modules/.test(module.resource)
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
                removeAttributeQuotes: true,
                minifyJS: true,
                html5: true,
                collapseWhitespace: true,
                removeStyleLinkTypeAttributes: true,
                removeScriptTypeAttributes: true
            }
        })
    ],
    module: {loaders},
    resolve: {
        alias: IS_PROD ? {
            'react': 'react-lite',
            'react-dom': 'react-lite'
        } : {}
    },
    postcss: postCssPlugins,
    commonPlugins  // for hmr
});
