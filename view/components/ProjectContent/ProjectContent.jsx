import {PropTypes} from 'react';

function ProjectContet(props) {
    return (<h1>props.for</h1>);
}

ProjectContet.for = 'green';

ProjectContet.propsTypes = {
    for: PropTypes.string.isRequired
};

export default ProjectContet;
