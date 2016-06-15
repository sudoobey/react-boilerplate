const webpackConfig = require('../webpack.config');
require('babel-register')({
    extensions: ['.jsx', '.css'],
    presets: ['es2015', 'react', 'stage-0'],
    plugins: [
        [
            'css-modules-transform', {
                generateScopedName: webpackConfig.STYLE_NAME_TEMPLATE,
                extensions: ['.css']
            }
        ]
    ]
});

const isProd = process.env.NODE_ENV !== 'development';
const path = require('path');
const requireDir = require('require-dir');

const http = require('http');
const Koa = require('koa');
const Router = require('koa-router');
const app = new Koa();

// body parser
const bodyParser = require('koa-bodyparser');
app.use(bodyParser());

// parse qs
require('koa-qs')(app);

if (isProd) {
    const compress = require('koa-compress');
    app.use(compress({
        threshold: 2048,
        flush: require('zlib').Z_SYNC_FLUSH
    }));
}

// logger
const logger = require('koa-logger');
app.use(logger());

// trust proxy
app.proxy = true;

// Routre controllers
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

// serve static
let staticRoute = new Router();
let serve = require('koa-static');
app.use(staticRoute.routes(), staticRoute.allowedMethods());

if (isProd) {
    const mount = require('koa-mount');
    app.use(
        mount(
            '/static',
            serve(path.resolve('client-dist'))
        )
    );
}

let reactRouter = require('./render-router');
app.use(reactRouter.routes(), reactRouter.allowedMethods());

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
