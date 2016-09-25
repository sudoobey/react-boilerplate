import {Router} from 'react-router';
import Helmet from 'react-helmet';

export default (routes, history) => function AppEntry() {
    return (<Router history={history} routes={routes}></Router>);
};
