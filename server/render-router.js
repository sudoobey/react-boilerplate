const Router = require('koa-router');
const App = require('../view/index.jsx').default;
const ReactDom = require('react-dom/server');
const React = require('react');
const routes = require('../view/router.jsx').default;
const ReactRouter = require('react-router');
const isProd = process.env.NODE_ENV !== 'development';
console.log(process.env.NODE_ENV);
const fs = require('fs');
const templateFileName = isProd ?
    './client-dist/index.html' :
    './view/index-dev.html';
const fileString = fs.readFileSync(templateFileName).toString();
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
