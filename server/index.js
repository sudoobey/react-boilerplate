require('babel-register')({
    extensions: ['.jsx']
});
const path = require('path');
const requireDir = require('require-dir');

const http = require('http');
const Koa = require('koa');
const fs = require('fs');
const Router = require('koa-router');
const app = new Koa();
const App = require('../client/components/Router/Router.jsx').default;
const ReactDom = require('react-dom/server');
const React = require('react');
const routes = require('../common/router.jsx').default;
const ReactRouter = require('react-router');
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

app.use(serve(path.resolve('client-dist')), {
    defer: true
});
let rootRoute = new Router();
rootRoute.get('*', (ctx, next) => {
    console.log('ctxurl:', ctx.url);
    console.log('url:', this.url);
    ReactRouter.match({
        routes,
        location: ctx.url
    }, (error, redirectLocation, renderProps) => {
        if (error) {
            ctx.status = 500;
            ctx.body = "Что-то пошло не так";
        } else if (redirectLocation) {
            ctx.redirect = 302;
        } else if (renderProps) {
            // You can also check renderProps.components or renderProps.routes for
            // your "not found" component or route respectively, and send a 404 as
            // below, if you're using a catch-all route.
            ctx.status = 200;
            ctx.body = (renderFullPage(
                ReactDom.renderToString(
                    React.createElement(
                        ReactRouter.RouterContext, renderProps, App)), {}));
        } else {
            ctx.status = 404;
            ctx.body = 'Not found';
        }
    });
    return next();
});
app.use(rootRoute.routes(), rootRoute.allowedMethods());

const server = http.createServer(app.callback());

// start server
if (!module.parent) {
    server.listen(
        5000,
        '0.0.0.0',
        () => console.log('Server listening on 5000')
    );
}

function renderFullPage(html) {
    console.log(html);
    return `<!doctype html>
    <html>
      <head>
        <title>Redux Universal Example</title>
        <link rel="stylesheet" href="/main.css" charset="utf-8">
      </head>
      <body>
        <div id="app">${html}</div>
        <script src="/bundle.js"></script>
      </body>
    </html>
`.replace('${html}', html);
}

module.exports = server;
