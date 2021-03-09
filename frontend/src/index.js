import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';
import './translations/i18n';
import LocaleProvider from './providers/config/Locale.provider'
import ThemeProvider from './providers/config/Theme.provider'


ReactDOM.render(
    <ThemeProvider>
        <BrowserRouter>
            <LocaleProvider>
                <App />
            </LocaleProvider>
        </BrowserRouter>
    </ThemeProvider>,
    document.getElementById('root'));

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
