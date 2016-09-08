const IS_PROD = process.env.NODE_ENV !== 'development';

const webpackConfig = require('../webpack.config');
require('babel-register')({
    only: /view\/.*|common\/.*/,
    extensions: ['.js', '.jsx', '.css'],
    presets: ['es2015', 'react', 'stage-0'],
    plugins: [
        'babel-plugin-transform-ensure-ignore',
        ['react-require', {extensions: ['.jsx']}],
        ['css-modules-transform', {
            generateScopedName: webpackConfig.STYLE_NAME_TEMPLATE,
            extensions: ['.css']
        }]
    ]
});

const path = require('path');
const requireDir = require('require-dir');

const http = require('http');
const Koa = require('koa');
const Router = require('koa-router');
const app = new Koa();

// usefull middlewares
app.use(require('koa-bodyparser')());
require('koa-qs')(app);
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

// API controllers
const controllers = requireDir('./controllers');
let apiRouter = new Router({
    prefix: '/api'
});
for (let name of Object.keys(controllers)) {
    let controller = controllers[name];
    controller.prefix(`/${name}`);
    apiRouter.use('', controller.routes(), controller.allowedMethods());
}
app.use(apiRouter.routes(), apiRouter.allowedMethods());

// Server-side rendering controller
let reactRouter = require('./render-router');
app.use(reactRouter.routes(), reactRouter.allowedMethods());

// Serve prebuilded static
const serve = require('koa-static');
const mount = require('koa-mount');

if (IS_PROD) {
    let distPath = path.join(__dirname, '../client-dist');
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
