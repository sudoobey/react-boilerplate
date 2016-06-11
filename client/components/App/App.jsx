import React from 'react';
import {Link} from 'react-router';
import style from './App.css';

export default class App extends React.Component {
    render() {
        return (
            <div className={style.root}>
                <div>Hello World</div>
                <Link to="about"><button>about</button></Link>
                <Link to="/"><button>home</button></Link>
                <div className={style.app}>{this.props.children}</div>
            </div>
        );
    }
}
