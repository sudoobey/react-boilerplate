const {
    createStore, combineReducers,
    applyMiddleware, compose
} = require('redux');
import {routerMiddleware} from 'react-router-redux';
const thunk = require('redux-thunk').default;
const reducers = require('./ducks/index').default;

const errorMiddleware = (store) => next => action => {
    try {
        return next(action);
    } catch (error) {
        console.error(error, store.getState());
        return error;
    }
};

let middlewares = [thunk, errorMiddleware].map(m => applyMiddleware(m));

if (process.env.IS_BROWSER) {
    const {browserHistory} = require('react-router');
    middlewares.push(
        applyMiddleware(routerMiddleware(browserHistory))
    );
}

if (process.env.NODE_ENV === 'development') {
    if (process.env.IS_BROWSER && window.devToolsExtension) {
        middlewares.push(window.devToolsExtension());
    }
}

module.exports = function configureStore(routerReducer) {
    if (routerReducer) {
        reducers.routing = routerReducer;
    }
    return createStore(
        combineReducers(reducers),
        compose(...middlewares)
    );
};
