const IS_PROD = process.env.NODE_ENV !== 'development';
const webpack = require('webpack');
const config = require('../config');

module.exports = function getBasicConfig() {
    const basicPlugins = [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(
                process.env.NODE_ENV || 'production')
        })
    ];

    const optimizationsPlugins = [
        new webpack.optimize.UglifyJsPlugin({
            compressor: {warnings: false},
            minimize: true
        })
    ];

    const loaders = [
        {
            test: /\.js$/,
            loader: 'babel-loader',
            exclude: /node_modules/
        },
        {
            test: /\.jsx$/,
            loader: 'babel-loader',
            exclude: /node_modules/
        }
    ];

    return {
        devtool: IS_PROD ? 'none' : 'inline-source-map',
        output: {
            publicPath: '/',
            filename: `${config.FILENAME_TEMPLATE}.js`,
            chunkFilename: `${config.FILENAME_CHUNK_TEMPLATE}.js`
        },
        plugins: [
            ...basicPlugins,
            ...(IS_PROD ? optimizationsPlugins : [])
        ],
        module: {loaders: loaders}
    };
};
