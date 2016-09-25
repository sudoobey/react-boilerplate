import {PropTypes} from 'react';
import Helmet from 'react-helmet';

function ProjectContet(props) {
    return (
        <h1>
            <Helmet title="Project Content"/>
            Content
        </h1>
    );
}

ProjectContet.for = 'green';

ProjectContet.propsTypes = {
    for: PropTypes.string.isRequired
};

export default ProjectContet;
