import App from '../view/components/App/App.jsx';
import About from '../view/components/About/About.jsx';

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
