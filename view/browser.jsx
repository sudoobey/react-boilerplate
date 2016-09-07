import {render} from 'react-dom';

import {browserHistory} from 'react-router';
import {syncHistoryWithStore, routerReducer} from 'react-router-redux';

import configureStore from '../common/configureStore';

const store = configureStore(routerReducer, browserHistory);
const history = syncHistoryWithStore(browserHistory, store);

window.onerror = (e) => console.error(e);

if (module.hot) {
    module.hot.accept();
}

import getApp from './get-app.jsx';

const App = getApp(store, history);

render(<App/>, document.getElementById('app'));
