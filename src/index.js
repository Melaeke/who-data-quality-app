import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

import { Provider } from 'react-redux'

import App from './App';
import * as serviceWorker from './serviceWorker';

//import { init } from 'd2'

import store from './store'


const baseUrl = process.env.REACT_APP_DHIS2_BASE_URL


ReactDOM.render(
    <Provider store={store}>
        <App url={baseUrl} appName="WHO Data Quality Tool" apiVersion={32} />
    </Provider>, 
    document.getElementById('root')
);




// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
