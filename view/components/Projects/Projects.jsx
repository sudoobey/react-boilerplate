import {Link} from 'react-router';
import classNames from 'classnames/bind';
import Project from '../Project/Project.jsx';
import styles from './Projects.css';
const cx = classNames.bind(styles);

const PROJECTS = ['blue', 'red', 'green', 'orange'];

function Projects(props) {
    let contentFor = props.children ? props.children.type.for : null;
    return (
        <div>
        {PROJECTS.map((projectName) => {
            let match = projectName === contentFor;
            return (
            <div>
                <Link
                    className={cx('projects__link', {
                        'projects__link--current': match
                    })}
                    to={`/projects/${projectName}`}
                    key={projectName}
                />
                <Project style={{background: projectName}}>
                    {match ? props.children : null}
                </Project>
            </div>
            );
        })}
        </div>
    );
}

export default Projects;
