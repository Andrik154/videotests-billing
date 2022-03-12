import React from 'react';
import ReactDOM from 'react-dom';
import { Router , Switch, Route} from 'wouter';
import './index.css';
import App from './App';
import Admin from './components/Admin';

window.API_LINK = 'https://toolstools.herokuapp.com/tests/api';
// window.API_LINK='http://localhost/tests/api';

ReactDOM.render(
  <React.StrictMode>
    <Router base="/tests">
      <Switch>
        <Route path="/admin" component={Admin} />
        <Route path="" component={App} />
      </Switch>
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
);