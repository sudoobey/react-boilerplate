const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const isProd = process.env.NODE_ENV === 'production';

const STYLE_NAME_TEMPLATE = '[name]_[local]_[hash:base64:5]';

let PLUGINS = [
    new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(
            process.env.NODE_ENV || 'development')
    }),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.optimize.DedupePlugin(),
    new ExtractTextPlugin('main.css', {
        allChunks: true
    })
];
if (isProd) {
    PLUGINS.push(
        new webpack.optimize.UglifyJsPlugin({
            compressor: {warnings: false},
            minimize: true
        })
    );
}

module.exports = {
    // constants
    STYLE_NAME_TEMPLATE: STYLE_NAME_TEMPLATE,

    devtool: 'inline-source-map',
    entry: ['./view/client.jsx'],
    output: {
        path: path.join(__dirname, 'client-dist'),
        filename: 'bundle.js'
    },
    plugins: PLUGINS,
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
                presets: ['es2015', 'stage-0']
            }
        }, {
            test: /\.jsx$/,
            loader: 'babel',
            exclude: /node_modules/,
            query: {
                presets: ['es2015', 'react', 'stage-0']
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
