const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const isProd = process.env.NODE_ENV !== 'development';

const STYLE_NAME_TEMPLATE = isProd ? '[hash:base64:5]' :
    '[name]_[local]_[hash:base64:5]';

const FileNameTemplate = isProd ? '[name].[hash]' : '[name]';

let PLUGINS = [
    new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(
            process.env.NODE_ENV || 'development')
    }),
    new ExtractTextPlugin(FileNameTemplate + '.css', {
        allChunks: true
    })
];
if (isProd) {
    PLUGINS.push(
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.UglifyJsPlugin({
            compressor: {
                warnings: false
            },
            minimize: true
        }),
        new HtmlWebpackPlugin({
            template: './view/index.html.template',
            minify: {
                removeAttributeQuotes: true,
                minifyJS: true,
                html5: true,
                collapseWhitespace: true,
                removeStyleLinkTypeAttributes: true,
                removeScriptTypeAttributes: true
            }
        })
    );
} else {
    PLUGINS.push(
        new webpack.HotModuleReplacementPlugin()
    );
}

let ENTRY = ['./view/client.jsx'];
if (!isProd) {
    ENTRY.push('webpack-hot-middleware/client');
}

let ALIAS;
if (isProd) {
    ALIAS = {
        'react': 'react-lite',
        'react-dom': 'react-lite'
    };
}

let LOADERS = [{
    test: /\.json$/,
    loader: 'json-loader'
}, {
    test: /\.js$/,
    loader: 'babel',
    exclude: /node_modules/,
    include: __dirname,
    query: {
        presets: ['es2015', 'stage-0']
    }
}, {
    test: /\.jsx$/,
    loaders: [{
        loader: 'react-hot'
    }, {
        loader: 'babel',
        query: {
            presets: ['es2015', 'react', 'stage-0']
        }
    }],
    exclude: /node_modules/,
    include: __dirname
}, {
    test: /\.css$/,
    loader: ExtractTextPlugin.extract('style-loader',
        `css-loader?${[
            'modules',
            'localIdentName=' + STYLE_NAME_TEMPLATE,
            isProd ? 'minimize' : null
        ].join('&')}`,
        'postcss-loader')
}];

if (isProd) {
    LOADERS.push({
        test: /\.html.template/,
        loader: 'html'
    });
}

module.exports = {
    // constants
    STYLE_NAME_TEMPLATE: STYLE_NAME_TEMPLATE,

    devtool: isProd ? 'none' : 'inline-source-map',
    entry: ENTRY,
    output: {
        path: path.join(__dirname, 'client-dist'),
        filename: FileNameTemplate + '.js',
        publicPath: isProd ? 'static' : '/'
    },
    plugins: PLUGINS,
    resolve: {
        alias: ALIAS,
        resolve: {
            extensions: ['.js', '.jsx', '']
        }
    },
    module: {
        loaders: LOADERS
    },
    postcss: function() {
        return [
            require('postcss-cssnext')()
        ];
    }
};
