const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
    devtool: 'inline-source-map',
    entry: [
        'webpack-hot-middleware/client',
        './client/index.jsx'
    ],
    output: {
        path: path.join(__dirname, 'client-dist'),
        filename: 'bundle.js',
        publicPath: '/static/'
    },
    plugins: [
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.UglifyJsPlugin({
            compressor: {
                warnings: false
            },
            minimize: true
        }),
        new ExtractTextPlugin('main.css')
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
            include: __dirname
                // query: {
                //     presets: ['es2015', 'stage-0']
                // }
        }, {
            test: /\.jsx$/,
            loader: 'babel',
            exclude: /node_modules/,
            include: __dirname
                // query: {
                //     presets: ['es2015', 'react', 'stage-0']
                // }
        }, {
            test: /\.css$/,
            loader: ExtractTextPlugin.extract(
                'isomorphic-style-loader',
                'css-loader?modules&localIdentName=[name]_[local]_[hash:base64:3]',
                'postcss-loader')
        }]
    },
    postcss: function() {
        return [
            require('autoprefixer')
        ];
    }
};
