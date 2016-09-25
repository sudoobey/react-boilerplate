import classNames from 'classnames/bind';

import styles from './Project.css';
const cx = classNames.bind(styles);

function Project(props) {
    return (
        <section className={cx(
            'project', {'project--expand': props.children}
        )}>
            <div className={styles.project__cover} style={props.style}/>
            <div className={styles.project__content}>
                {props.children}
            </div>
        </section>
    );
}

export default Project;
