import {Link} from 'react-router';
import Project from '../Project/Project.jsx';
import styles from './Projects.css';

const PROJECTS = ['blue', 'red', 'green', 'orange'];

function Projects(props) {
    let contentFor = props.children ? props.children.type.for : null;
    return (
        <div>
        {PROJECTS.map((projectName) =>
            <Link
                className={styles.projects__item}
                to={`/projects/${projectName}`}
                key={projectName}
            >
                <Project style={{background: projectName}}>
                    {projectName === contentFor ? props.children : null}
                </Project>
            </Link>
        )}
        </div>
    );
}

export default Projects;
