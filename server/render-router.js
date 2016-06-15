const Router = require('koa-router');
const App = require('../view/index.jsx').default;
const ReactDom = require('react-dom/server');
const React = require('react');
const routes = require('../view/router.jsx').default;
const ReactRouter = require('react-router');
const isProd = process.env.NODE_ENV !== 'development';

const fs = require('fs');
const fileString = fs.readFileSync('./view/index.html').toString();
function renderFullPage(html) {
    return fileString.replace('${html}', html);
}

let renderRouter = new Router();
renderRouter.get('*', (ctx, next) => {
    ReactRouter.match({
        routes,
        location: ctx.url
    }, (error, redirectLocation, renderProps) => {
        if (error) {
            ctx.status = 500;
            ctx.body = 'Что-то пошло не так';
        } else if (redirectLocation) {
            ctx.redirect = 302;
        } else if (renderProps) {
            // You can also check renderProps.components or renderProps.routes for
            // your 'not found' component or route respectively, and send a 404 as
            // below, if you're using a catch-all route.
            ctx.status = 200;
            if (isProd) {
                ctx.body = (renderFullPage(
                    ReactDom.renderToString(
                        React.createElement(
                            ReactRouter.RouterContext, renderProps, App)), {}));
            } else {
                ctx.body = renderFullPage('development mode >> loading <3');
            }
        } else {
            return next();
        }
    });
});

module.exports = renderRouter;
