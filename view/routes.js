import App from './components/App/App.jsx';

export default {
    path: '/',
    component: App,
    childRoutes: [
        {
            path: 'about',
            getComponent: (location, cb) => require.ensure(
                [],
                (require) => cb(null,
                    require('./components/About/About.jsx').default),
                'page-about'
            )
        }
    ]
};
