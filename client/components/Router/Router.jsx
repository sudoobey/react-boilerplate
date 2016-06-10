import React from 'react';
import {Router, Route, Link, browserHistory} from 'react-router';

import routes from '../../../common/router.jsx';

export default class RouterWrap extends React.Component {
    render() {
        // return (
        //     <div>
        //         <div>Hello World</div>
        //         <div>{this.props.children}</div>
        //     </div>
        // );
        return <Router history={browserHistory} routes={routes}></Router>;
    }
}

// export default ()
