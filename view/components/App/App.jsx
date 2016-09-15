import React from 'react';
import style from './App.css';

export default class App extends React.Component {
    render() {
        return (
            <div className={style.wrap}>
                {this.props.children}
            </div>
        );
    }
}
