import App from '../client/components/App/App.jsx';
import About from '../client/components/About/About.jsx';

export default {
    path: '/',
    component: App,
    childRoutes: [
        {
            path: 'about',
            component: About
        }
    ]
};
