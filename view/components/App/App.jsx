import React from 'react';
import Helmet from 'react-helmet';
import style from './App.css';

import Menu from '../Menu/Menu.jsx';

export default class App extends React.Component {
    render() {
        return (
            <div>
                <Helmet
                    title="Projects"
                    titleTemplate="SudoObey — %s"
                />
                <main className={style.main}>
                    {this.props.children}
                </main>
                <Menu/>
            </div>
        );
    }
}
