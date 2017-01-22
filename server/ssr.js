const IS_PROD = process.env.NODE_ENV !== 'development';

const fs = require('fs');
const ReactDom = require('react-dom/server');
const React = require('react');
const ReactRouter = require('react-router');

const config = require('../config');
const intexHtmlPath = IS_PROD ? config.INDEX_TMPL_BUILDED : config.INDEX_TMPL;
const indexHtmlString = fs.readFileSync(intexHtmlPath).toString();

function renderApp(renderProps, viewBundle) {
    let {getApp, routes, Helmet} = viewBundle;
    let App = getApp(routes);
    let app = React.createElement(
        ReactRouter.RouterContext,
        renderProps,
        App
    );
    let initialState = {};
    let htmlBodyString = ReactDom.renderToString(app, initialState);
    let params = {
        '❤': htmlBodyString
    };

    let helmet = Helmet.rewind();
    let helmetKeys = Object.keys(helmet);
    for (let key of helmetKeys) {
        params['helmet_' + key.toLowerCase()] = helmet[key].toString();
    }

    let fullPage = indexHtmlString;
    for (let key of Object.keys(params)) {
        fullPage = fullPage.replace('<!--{' + key + '}-->', params[key]);
    }
    fullPage = fullPage.replace(
        ' {helmet_htmlattributes}',
        params.helmet_htmlAttributes || ''
    );
    return fullPage;
}

module.exports = {renderApp};
