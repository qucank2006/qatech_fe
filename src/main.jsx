import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { RouterProvider } from 'react-router-dom';
import store from './redux/store';
import router from './router';
import './index.css';
import './assets/styles/global.css';

/**
 * Entry Point - Điểm khởi đầu của ứng dụng React
 * Cấu hình Redux Provider và React Router
 */
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>
);
