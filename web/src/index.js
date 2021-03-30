import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import './App.css';
import reportWebVitals from './reportWebVitals';
import {Provider} from "react-redux";
import Store from "./Store";
import {BrowserRouter} from "react-router-dom";
import { config } from '../src/utils/Constants';
import axios from "axios";

axios.defaults.baseURL = config.url.API_URL
axios.defaults.headers = {
    "Access-Control-Allow-Origin": "*",
    "Accept": "application/json",
    "Content-Type": "application/json"
}

ReactDOM.render(
    <React.StrictMode>
        <BrowserRouter>
            <Provider store={Store}>
                <App />
            </Provider>
        </BrowserRouter>
    </React.StrictMode>,

    document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
