const IS_PROD = process.env.NODE_ENV !== 'development';

const fs = require('fs');
const path = require('path');

const Router = require('koa-router');
const getApp = require('../view/get-app.jsx').default;
const ReactDom = require('react-dom/server');
const React = require('react');
const routes = require('../view/routes').default;
const ReactRouter = require('react-router');

const configureStore = require('../common/configureStore');

const webpackConfig = require('../webpack.config');
const INDEX_HTML = path.join(webpackConfig.OUTPUT_DIR, 'index.html');
const INDEX_HTML_STRING = fs.readFileSync(INDEX_HTML).toString();

function renderFullPage(html) {
    return INDEX_HTML_STRING.replace('{{app}}', html);
}

function createApp(renderProps) {
    const store = configureStore();
    let App = getApp(store);
    return React.createElement(
        ReactRouter.RouterContext,
        renderProps,
        App
    );
}

function renderApp(renderProps) {
    let initialState = {};
    let app = createApp(renderProps);
    let htmlString = ReactDom.renderToString(app, initialState);
    return renderFullPage(htmlString);
}

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
                    ctx.body = renderApp(renderProps);
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
