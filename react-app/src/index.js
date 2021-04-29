import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import './index.css';
import App from './App';
import configureStore from './store';
import ServerProvider from './context/ServerContext';
import ChannelProvider from './context/ChannelContext';

const store = configureStore();

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <ServerProvider>
        <ChannelProvider>
          <App />
        </ChannelProvider>
      </ServerProvider>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);
