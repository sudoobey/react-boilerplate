import App from './components/App/App.jsx';
import Projects from './components/Projects/Projects.jsx';
import ProjectContent from './components/ProjectContent/ProjectContent.jsx';

// getComponent(nextState, cb) {
//     require.ensure([], () => {
//         class Content extends ProjectContent {}
//         Content.for = 'blue';
//         cb(null, Content);
//     });
// }

export default {
    path: '/',
    component: App,
    indexRoute: {component: Projects},
    childRoutes: [
        {
            path: 'projects',
            component: Projects,
            childRoutes: [
                {path: 'blue', component: ProjectContent},
                {path: 'red', component: ProjectContent},
                {path: 'green', component: ProjectContent},
                {path: 'orange', component: ProjectContent}
            ]
        }
    ]
};
