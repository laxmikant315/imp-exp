import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import App from './App';
import * as serviceWorker from './serviceWorker';

// @ts-ignore
import io from 'socket.io-client';

ReactDOM.render(<App />, document.getElementById('root'));

// var socket = io('http://localhost:4001');

// socket.on('connection', (data: any) => {
//   console.log(data);
// });
// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
