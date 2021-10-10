import React from 'react';
import ReactDOM from 'react-dom';
import { Router } from 'wouter';
import './index.css';
import App from './App';

window.API_LINK = 'https://toolstools.herokuapp.com/tests/api';

ReactDOM.render(
  <React.StrictMode>
    <Router base="/tests">
      <App />
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
);