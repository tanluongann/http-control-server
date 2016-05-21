import React from 'react';
import ReactDOM from 'react-dom';
import {Router, Route, hashHistory} from 'react-router';
import {createStore, applyMiddleware} from 'redux';
import {Provider} from 'react-redux';
import io from 'socket.io-client';
import reducer from './reducer';
import App from './components/App';
import startSocket, {socketMiddleware} from './middleware/sockets';
import {DevicesContainer} from './components/Devices';

const createStoreWithMiddleware = applyMiddleware(socketMiddleware)(createStore);
const store = createStoreWithMiddleware(reducer);

startSocket(store);

const routes = <Route component={App}>
  <Route path="/" component={DevicesContainer} />
</Route>;

ReactDOM.render(
  <Provider store={store}>
    <Router history={hashHistory}>{routes}</Router>
  </Provider>,
  document.getElementById('app')
);
