import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Auth0Provider } from '@auth0/auth0-react';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Auth0Provider
    domain="dev-8rtqicqmg32ozcm3.us.auth0.com"
    clientId="rUyZZmmR7g0p0cQm5VEE34IG73LhuYUd"
    redirectUri={window.location.origin}
  >
  <React.StrictMode>
    <App />
  </React.StrictMode>
  </Auth0Provider>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
