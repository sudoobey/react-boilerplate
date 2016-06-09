require('babel-register')({
    extensions: ['.jsx']
});
const path = require('path');
const requireDir = require('require-dir');

const http = require('http');
const Koa = require('koa');
const Router = require('koa-router');
const mount = require('koa-mount');
const app = new Koa();
const App = require('../client/components/App/App.jsx').default;
const ReactDom = require('react-dom/server');
const React = require('react');

// body parser
const bodyParser = require('koa-bodyparser');
app.use(bodyParser());

// parse qs
require('koa-qs')(app);

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
app.use(mount(
    '/node_modules',
    serve(path.join(__dirname, '/node_modules'))
));
app.use(serve(path.join(__dirname, '/client')), {
    defer: true
});
app.use(mount(
    '/',
    (ctx, next) => (
        ctx.body = renderFullPage(
            ReactDom.renderToString(
                React.createElement(App, null, null)), {})
    )
));
const server = http.createServer(app.callback());

// start server
if (!module.parent) {
    server.listen(
        5555,
        '0.0.0.0',
        () => console.log('Server listening on 5555')
    );
}

function renderFullPage(html, preloadedState) {
    return `
    <!doctype html>
    <html>
      <head>
        <title>Redux Universal Example</title>
      </head>
      <body>
        <div id="app">${html}</div>
        <script>
          window.__PRELOADED_STATE__ = ${JSON.stringify(preloadedState)}
        </script>
        <script src="/static/bundle.js"></script>
      </body>
    </html>
    `;
}

module.exports = server;
