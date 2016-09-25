import React from 'react';
import {Link} from 'react-router';
import styles from './Menu.css';

import classNames from 'classnames/bind';
const cx = classNames.bind(styles);

export default class Menu extends React.Component {
    constructor() {
        super();
        this.state = {
            active: false
        };
    }

    toggleMenu() {
        this.setState({active: !this.state.active});
    }

    hideMenu() {
        this.setState({active: false});
    }

    openMenu() {
        this.setState({active: true});
    }

    render() {
        let active = this.state.active;
        let toggle = this.toggleMenu.bind(this);
        let hide = this.hideMenu.bind(this);
        let open = this.openMenu.bind(this);
        return (
            <nav className={cx({active})}>
                <div onClick={hide} className={styles.nav_close_region}/>
                <div className={styles.nav}>
                    <div className={styles.nav_open_region}
                        onTouchStart={open}/>
                    <Link className={styles.nav__link} to="#">wtf</Link>
                </div>
                <div className={styles.nav_button} onClick={toggle}>
                    <div className={styles.menu_icon}>
                        <div className={styles.menu_icon__stick}/>
                        <div className={styles.menu_icon__stick}/>
                        <div className={styles.menu_icon__stick}/>
                    </div>
                </div>
            </nav>
        );
    }
}
