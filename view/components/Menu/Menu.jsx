import React from 'react';
import {Link} from 'react-router';
import styles from './Menu.css';

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
        return (
            <nav>
                <div className={cx('nav', {'nav--active': this.state.active})}>
                    <Link className={styles.nav__link} to="#">wtf</Link>
                </div>
                <div className={styles.nav_button}
                    onClick={() => this.toggleMenu()}></div>
            </nav>
        );
    }
}
