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
import {HomePageContainer} from './components/HomePage';
import {AccessPageContainer} from './components/AccessPage';

const createStoreWithMiddleware = applyMiddleware(socketMiddleware)(createStore);
const store = createStoreWithMiddleware(reducer);

startSocket(store);

const routes = <Route component={App}>
  <Route path="/ujw_admin" component={DevicesContainer} />
  <Route path="/access/:device" component={AccessPageContainer} />
  <Route path="/" component={HomePageContainer} />
</Route>;

ReactDOM.render(
  <Provider store={store}>
    <Router history={hashHistory}>{routes}</Router>
  </Provider>,
  document.getElementById('app')
);
