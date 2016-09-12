import App from './components/App/App.jsx';

function errorLoading(err) {
    console.error('Dynamic page loading failed', err);
}

function loadRoute(cb) {
    return (module) => cb(null, module.default);
}

export default {
    path: '/',
    component: App,
    childRoutes: [
        {
            path: 'about',
            getComponent(location, cb) {
                System.import('./components/About/About.jsx')
                .then(loadRoute(cb)).catch(errorLoading);
            }
        }
    ]
};
