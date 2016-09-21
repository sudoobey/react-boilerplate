import App from './components/App/App.jsx';

export default {
    path: '/',
    component: App,
    indexRoute: {component: require('./pages/Home/Home.jsx').default},
    childRoutes: []
};
