const IS_PROD = process.env.NODE_ENV !== 'development';
const webpack = require('webpack');
const config = require('../config');

const os = require('os');
const CPU_COUNT = os.cpus().length;
const HappyPack = require('happypack');

module.exports = function getBasicConfig(name) {
    const happyThreadPool = HappyPack.ThreadPool({size: CPU_COUNT});
    const happyWorkersTargets = ['js', 'jsx'];
    if (name.includes('web') && !IS_PROD) {
        happyWorkersTargets.push('css-dev');
    }
    const happyWorkers = happyWorkersTargets.map(
        (target) => new HappyPack({
            id: `${target}-${name}`,
            threadPool: happyThreadPool
        })
    );

    const basicPlugins = [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(
                process.env.NODE_ENV || 'production')
        })
    ];

    const optimizationsPlugins = [
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.UglifyJsPlugin({
            compressor: {warnings: false},
            minimize: true
        })
    ];

    let jsxLoader = {
        test: /\.jsx$/,
        happy: {id: `jsx-${name}`},
        exclude: /node_modules/
    };
    if (IS_PROD) {
        jsxLoader.loader = 'babel';
    } else {
        jsxLoader.loaders = ['react-hot', 'babel'];
    }

    let loaders = [
        jsxLoader,
        {
            test: /\.js$/,
            loader: 'babel',
            happy: {id: `js-${name}`},
            exclude: /node_modules/
        },
        {
            test: /\.json$/,
            loader: 'json-loader'
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
            ...happyWorkers,
            ...basicPlugins,
            ...(IS_PROD ? optimizationsPlugins : [])
        ],
        module: {loaders: loaders},
        postcss: [
            require('postcss-cssnext')
        ]
    };
};
