import constants from './constants';
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Web3ReactProvider } from '@web3-react/core'
import { Web3Provider } from "@ethersproject/providers";
import { BrowserRouter, HashRouter } from "react-router-dom";
import {
  ChakraProvider,
} from '@chakra-ui/react';
import theme from './theme';

import '@fontsource/kanit/400.css'
import '@fontsource/kanit/700.css'

function getLibrary(provider) {
  return new Web3Provider(provider);
}

const Router = constants.IS_GITHUB_PAGES ?
  HashRouter :
  BrowserRouter;

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <Web3ReactProvider getLibrary={getLibrary}>
        <Router>
          <App />
        </Router>
      </Web3ReactProvider>
    </ChakraProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
