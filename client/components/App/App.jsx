import React from 'react';
// import style from './App.css';

export default class App extends React.Component {
    render() {
        return (
            <div>
                <div>Hello World</div>
                <div>{this.props.children}</div>
            </div>
        );
        // return <div>Hello World</div>;
    }
}
