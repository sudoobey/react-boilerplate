import React from 'react';
import {Router, browserHistory} from 'react-router';
import {createStore, combineReducers, applyMiddleware} from 'redux';
import {Provider} from 'react-redux';
import {syncHistoryWithStore, routerReducer} from 'react-router-redux';

import routes from './router.jsx';
const isBrowser = typeof window !== 'undefined';

const DEFAULT_APP_STATE = {};

let devMiddleware;
if (isBrowser) {
    devMiddleware = window.devToolsExtension ?
        window.devToolsExtension() : undefined;
}

const store = createStore(
    combineReducers({
        routing: routerReducer
    }),
    DEFAULT_APP_STATE,
    devMiddleware
);

const history = isBrowser ?
    syncHistoryWithStore(browserHistory, store) : browserHistory;

export default class RouterWrap extends React.Component {
    render() {
        return (
            <Provider store={store}>
                <Router history={history} routes={routes}></Router>
            </Provider>
        );
    }
}
