import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { UserContextProvider } from './utils/UserContext';
// import { BrowserRouter as Router } from "react-router-dom"
import { HashRouter } from "react-router-dom"

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
     <UserContextProvider>
    <HashRouter>
    <App />
    </HashRouter>
    </UserContextProvider>
     
  </React.StrictMode>
);

