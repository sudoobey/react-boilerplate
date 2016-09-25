const reactRouterToArray = require('react-router-to-array');
const ReactRouter = require('react-router');
const {renderApp} = require('./server/ssr');

const confg = require('./config');
const serverViewBundle = require(confg.NODE_BUNDLE);
const {routes} = serverViewBundle;
const path = require('path');
const fse = require('fs-extra');

const locations = reactRouterToArray(routes);

for (let location of locations) {
    ReactRouter.match({
        routes, location
    }, (error, redirectLocation, renderProps) => {
        if (error) {
            console.error(error);
        } else if (redirectLocation) {
            console.error('Unexpected redirect', redirectLocation.pathname);
        } else if (renderProps) {
            // You can also check renderProps.components or renderProps.routes for
            // your 'not found' component or route respectively, and send a 404 as
            // below, if you're using a catch-all route.
            let fullPage = renderApp(renderProps, serverViewBundle);
            let filePath = path.join(
                confg.OUTPUT_DIR_WEB, location, 'index.html');
            console.log(`location: ${location} write file: ${filePath}`);
            fse.outputFileSync(filePath, fullPage);
        }
    });
}
