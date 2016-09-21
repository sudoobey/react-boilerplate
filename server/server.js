const IS_PROD = process.env.NODE_ENV !== 'development';

const path = require('path');

const http = require('http');
const Koa = require('koa');
const app = new Koa();
const config = require('../config');

// usefull middlewares
app.use(require('koa-bodyparser')());
// trust proxy
app.proxy = true;

if (IS_PROD) {
    const compress = require('koa-compress');
    app.use(compress({
        threshold: 2048,
        flush: require('zlib').Z_SYNC_FLUSH
    }));
}

// logger
const logger = require('koa-logger');
app.use(logger());

// Server-side rendering controller
let reactRouter = require('./render-router');
app.use(reactRouter.routes(), reactRouter.allowedMethods());

// Serve prebuilded static
const serve = require('koa-static');
const mount = require('koa-mount');

if (IS_PROD) {
    let distPath = config.OUTPUT_DIR_WEB;
    app.use(mount('/', serve(distPath), {defer: true}));
} else {
    let nodeModulesPath = path.join(__dirname, '../node_modules');
    app.use(mount('/node_modules', serve(nodeModulesPath)));
    const webpackDev = require('./middlewares-webpack');
    app.use(webpackDev.webpackDevMiddleware);
    app.use(webpackDev.webpackHotMiddleware);
}

const server = http.createServer(app.callback());

// start server
if (!module.parent) {
    server.listen(
        5000,
        '0.0.0.0',
        () => console.log('Server listening on 5000')
    );
}

module.exports = {server, app};
