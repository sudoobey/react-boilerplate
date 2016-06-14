const path = require('path');
// const fs = require('fs');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const STYLE_NAME_TEMPLATE = '[name]_[local]_[hash:base64:5]';

module.exports = {
    // constants
    STYLE_NAME_TEMPLATE: STYLE_NAME_TEMPLATE,

    devtool: 'inline-source-map',
    entry: [
        // 'webpack-hot-middleware/client',
        './client/index.jsx'
    ],
    output: {
        path: path.join(__dirname, 'client-dist'),
        filename: 'bundle.js',
        publicPath: '/static/'
    },
    plugins: [
        new webpack.optimize.OccurrenceOrderPlugin(),
        // new webpack.HotModuleReplacementPlugin(),
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.UglifyJsPlugin({
            compressor: {
                warnings: false
            },
            minimize: true
        }),
        new ExtractTextPlugin('main.css', {
            allChunks: true
        })
    ],
    resolve: {
        alias: {
            'react': 'react-lite',
            'react-dom': 'react-lite'
        },
        resolve: {
            extensions: ['.js', '.jsx', '']
        }
    },
    module: {
        loaders: [{
            test: /\.js$/,
            loader: 'babel',
            exclude: /node_modules/,
            include: __dirname,
            query: {
                presets: ["es2015", "react", "stage-0"],
                plugins: []
            }
        }, {
            test: /\.jsx$/,
            loader: 'babel',
            exclude: /node_modules/,
            query: {
                presets: ["es2015", "react", "stage-0"],
                plugins: []
            },
            include: __dirname
        }, {
            test: /\.css$/,
            loader: ExtractTextPlugin.extract(
                'style-loader',
                `css-loader?modules&localIdentName=${STYLE_NAME_TEMPLATE}`,
                'postcss-loader')
        }]
    },
    postcss: function() {
        return [
            require('postcss-cssnext')(),
            require('autoprefixer')
        ];
    }
};
