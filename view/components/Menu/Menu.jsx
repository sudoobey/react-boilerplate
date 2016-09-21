import React from 'react';
import {Link} from 'react-router';
import styles from './Menu.css';

// import {MorphReplace} from 'react-svg-morph';
import IconMenu from 'react-icons/lib/md/menu';
import IconClose from 'react-icons/lib/md/close';

import classNames from 'classnames/bind';
const cx = classNames.bind(styles);

export default class App extends React.Component {
    constructor() {
        super();
        this.state = {
            active: false
        };
    }

    toggleMenu() {
        this.setState({active: !this.state.active});
    }

    render() {
        let active = this.state.active;
        let toggle = this.toggleMenu.bind(this);
        return (
            <nav>
                <div className={cx('nav', {'nav--active': active})}>
                    <Link className={styles.nav__link} to="#">wtf</Link>
                </div>
                <div className={styles.nav_button} onClick={toggle}>
                    {active ? <IconMenu size={50}/> : <IconClose size={50}/>}
                </div>
            </nav>
        );
    }
}
