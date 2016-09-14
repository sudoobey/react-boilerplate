const IS_PROD = process.env.NODE_ENV !== 'development';
const config = require('../config');
let getApp = null;
let routes = null;
if (IS_PROD) {
    let forServer = require(config.NODE_BUNDLE);
    getApp = forServer.getApp;
    routes = forServer.routes;
} else {
    require('babel-register')({
        only: /view\/.*|common\/.*/,
        plugins: [
            'system-import-transformer',
            ['css-modules-transform', {
                generateScopedName: config.STYLE_NAME_TEMPLATE,
                extensions: ['.css']
            }]
        ]
    });
    getApp = require('../view/app.jsx').default;
    routes = require('../view/routes.js').default;
}

const Router = require('koa-router');
const ReactRouter = require('react-router');
const {renderApp} = require('./ssr');

let renderRouter = new Router();
renderRouter.get('*', (ctx, next) => {
    return new Promise((resolve, reject) => {
        ReactRouter.match({
            routes,
            location: ctx.url
        }, (error, redirectLocation, renderProps) => {
            if (error) {
                reject(error);
            } else if (redirectLocation) {
                ctx.redirect(redirectLocation.pathname);
            } else if (renderProps) {
                // You can also check renderProps.components or renderProps.routes for
                // your 'not found' component or route respectively, and send a 404 as
                // below, if you're using a catch-all route.
                if (IS_PROD) {
                    ctx.body = renderApp(renderProps, getApp, routes);
                } else {
                    // HACK: HRM don't know about react router,
                    // but we want render index.html if path resolved
                    let originalUrl = ctx.req.url;
                    ctx.req.url = '/';
                    return resolve(next().then(() => {
                        ctx.req.url = originalUrl;
                    }));
                }
            } else {
                return resolve(next());
            }
            resolve();
        });
    });
});

module.exports = renderRouter;
