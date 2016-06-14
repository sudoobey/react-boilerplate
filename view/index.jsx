import React from 'react';
import {Router, browserHistory} from 'react-router';

import routes from './router.jsx';

export default class RouterWrap extends React.Component {
    render() {
        return <Router history={browserHistory} routes={routes}></Router>;
    }
}
