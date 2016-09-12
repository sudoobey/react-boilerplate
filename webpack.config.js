const webpackConfigNode = require('./webpack/webpack.config.node');
const webpackConfigWeb = require('./webpack/webpack.config.web');

module.exports = [webpackConfigWeb, webpackConfigNode];
