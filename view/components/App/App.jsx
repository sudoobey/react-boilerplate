import React from 'react';
import {Link, IndexLink} from 'react-router';
import style from './App.css';

export default class App extends React.Component {
    render() {
        return (
            <div className={style.root}>
                <div>Hello World</div>
                <Link to="about" activeClassName={style.active}><button className={style.btn}>about</button></Link>
                <IndexLink to="/" activeClassName={style.active}><button className={style.btn}>home</button></IndexLink>
                <div className={style.app}>{this.props.children}</div>
            </div>
        );
    }
}
