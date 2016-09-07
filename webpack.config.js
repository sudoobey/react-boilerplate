const IS_PROD = process.env.NODE_ENV !== 'development';

const path = require('path');

const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const STYLE_NAME_TEMPLATE = IS_PROD ? '[hash:base64:5]' : '[name]_[local]_[hash:base64:5]';
const FILENAME_TEMPLATE = IS_PROD ? '[name].[hash]' : '[name]';
const INDEX_HTML = './view/index.html';
const OUTPUT_DIR = './client-dist';

let entry = ['./view/browser.jsx'];
if (!IS_PROD) {
    entry.push('webpack-hot-middleware/client');
}

let alias;
if (IS_PROD) {
    alias = {
        'react': 'react-lite',
        'react-dom': 'react-lite'
    };
}

let plugins = [
    new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(
            process.env.NODE_ENV || 'production')
    }),
    new ExtractTextPlugin({
        filename: `${FILENAME_TEMPLATE}.css`,
        allChunks: true
    }),
    new HtmlWebpackPlugin({
        template: INDEX_HTML,
        minify: {
            removeAttributeQuotes: true,
            minifyJS: true,
            html5: true,
            collapseWhitespace: true,
            removeStyleLinkTypeAttributes: true,
            removeScriptTypeAttributes: true
        }
    })
];

if (IS_PROD) {
    plugins.push(
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.UglifyJsPlugin({
            compressor: {warnings: false},
            minimize: true
        })
    );
} else {
    plugins.push(
        new webpack.HotModuleReplacementPlugin()
    );
}

let loaders = [
    {
        test: /\.json$/,
        loader: 'json-loader'
    },
    {
        test: /\.js$/,
        loader: 'babel',
        exclude: /node_modules/,
        include: __dirname,
        query: {
            presets: ['es2015', 'stage-0']
        }
    },
    {
        test: /\.jsx$/,
        loaders: [
            {loader: 'react-hot'},
            {
                loader: 'babel',
                query: {
                    plugins: ['react-require'],
                    presets: ['es2015', 'react', 'stage-0']
                }
            }
        ],
        exclude: /node_modules/,
        include: __dirname
    }
];

if (IS_PROD) {
    loaders.push({
        test: /\.css$/,
        loader: ExtractTextPlugin.extract({
            fallbackLoader: 'style?sourceMap',
            loader: `css?${[
                'modules',
                'localIdentName=' + STYLE_NAME_TEMPLATE,
                'minimize'
            ].join('&')}!postcss-loader`
        })
    });
} else {
    loaders.push({
        test: /\.css$/,
        loaders: [
            'style?sourceMap',
            `css?${[
                'modules',
                'localIdentName=' + STYLE_NAME_TEMPLATE
            ].join('&')}!postcss-loader`
        ]
    });
}

module.exports = {
    // constants
    OUTPUT_DIR, STYLE_NAME_TEMPLATE, INDEX_HTML,

    devtool: IS_PROD ? 'none' : 'inline-source-map',
    entry: entry,
    output: {
        path: path.join(__dirname, OUTPUT_DIR),
        filename: `${FILENAME_TEMPLATE}.js`,
        publicPath: '/'
    },
    plugins: plugins,
    resolve: {
        alias: alias,
        resolve: {extensions: ['.js', '.jsx', '']}
    },
    module: {loaders: loaders},
    postcss: [
        require('postcss-cssnext')
    ]
};
