import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import './index.css';
import './antd-table.css';
import "react-datepicker/dist/react-datepicker.css";
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Toaster } from 'react-hot-toast';
import './styling/report-dashboard.css';
import './styling/report-datasets.css';
import './styling/report-reports.css'
import './Crm.css';
import './crm.scss';

import { store } from './redux/store'
import { Provider } from 'react-redux'

ReactDOM.render(
  <Provider store={store}>
    <HelmetProvider>
      <BrowserRouter>
        <App />
        <Toaster />
      </BrowserRouter>
    </HelmetProvider>
  </Provider>,
  document.getElementById('root')
);


// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
