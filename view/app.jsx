import {Router} from 'react-router';

export default (routes, history) => function AppEntry() {
    return (<Router history={history} routes={routes}></Router>);
};
