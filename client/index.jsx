import {render} from 'react-dom';
import React from 'react';
import RouterWrap from './components/Router/Router.jsx';
// import About from './components/About/About.jsx';
// import {Router, Route, Link, browserHistory} from 'react-router';

// import routes from '../common/router.jsx';

render(
    (<RouterWrap />)
    , document.getElementById('app'));
