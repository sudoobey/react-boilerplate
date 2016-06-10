export default {
    path: '/',
    component: require('../client/components/App/App.jsx').default,
    childRoutes: [
        {
            path: 'about',
            component: require('../client/components/About/About.jsx').default
        }
    ]
};
