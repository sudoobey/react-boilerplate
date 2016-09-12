import {Router} from 'react-router';

export default (routes, history) => () => (
    <Router history={history} routes={routes}></Router>
);
