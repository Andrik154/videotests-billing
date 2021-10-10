import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Router } from 'wouter';

window.city = JSON.parse(localStorage.getItem('city')) || {title:'Москва', id:'74013271'};
window.CDN_PREFIX = 'https://s82079.cdn.ngenix.net/';

ReactDOM.render(
  <React.StrictMode>
    <Router base="/kfc">
      <App />
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
