import React from 'react';
import style from './App.css';

import Menu from '../Menu/Menu.jsx';

export default class App extends React.Component {
    render() {
        return (
            <div>
                <div className={style.wrap}>
                    {this.props.children}
                </div>
                <Menu/>
            </div>
        );
    }
}
