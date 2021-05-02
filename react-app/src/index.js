import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import './index.css';
import './contextMenu.css';
import App from './App';
import configureStore from './store';
import ChannelProvider from './context/ChannelContext';

const store = configureStore();

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <ChannelProvider>
        <App />
      </ChannelProvider>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);
