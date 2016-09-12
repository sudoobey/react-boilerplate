const IS_PROD = process.env.NODE_ENV !== 'development';

const fs = require('fs');
const ReactDom = require('react-dom/server');
const React = require('react');
const ReactRouter = require('react-router');

const config = require('../config');
let indexHtmlString = '';
if (IS_PROD) {
    indexHtmlString = fs.readFileSync(config.INDEX_TMPL_BUILDED).toString();
}

function renderFullPage(html) {
    return indexHtmlString.replace('❤', html);
}

function renderApp(renderProps, getApp, routes) {
    let App = getApp(routes);
    let app = React.createElement(
        ReactRouter.RouterContext,
        renderProps,
        App
    );
    let initialState = {};
    let htmlString = ReactDom.renderToString(app, initialState);
    return renderFullPage(htmlString);
}

module.exports = {renderFullPage, renderApp};
