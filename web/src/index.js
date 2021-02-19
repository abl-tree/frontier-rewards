import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {Provider} from "react-redux";
import Store from "./Store";
import {BrowserRouter} from "react-router-dom";
import axios from "axios";

axios.defaults.baseURL = "http://localhost:8000/";
axios.defaults.headers['Accept'] = "application/json";
axios.defaults.headers['Content-Type'] = "application/json";
// axios.defaults.headers.common['Authorization'] = "Bearer " + localStorage.getItem('token');

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
