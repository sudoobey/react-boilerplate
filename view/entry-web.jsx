import {render} from 'react-dom';
import {browserHistory, match} from 'react-router';

window.onerror = (e) => console.error(e);

if (module.hot) {
    module.hot.accept();
}

import routes from './routes.js';
import getApp from './app.jsx';

match(
    {routes, history: browserHistory},
    (error, redirectLocation, renderProps) => {
        const App = getApp(routes, browserHistory);
        render(<App {...renderProps}/>, document.getElementById('app'));
    }
);
