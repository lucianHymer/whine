import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Web3ReactProvider } from '@web3-react/core'
import { Web3Provider } from "@ethersproject/providers";
import {
  ChakraProvider,
  extendTheme,
  withDefaultColorScheme,
  theme as baseTheme,
} from '@chakra-ui/react'

const customTheme = extendTheme(
  {
    colors: {
      primary: baseTheme.colors.purple,
    },
  },
  withDefaultColorScheme({ colorScheme: 'primary' })
);

function getLibrary(provider) {
  return new Web3Provider(provider);
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ChakraProvider theme={customTheme}>
      <Web3ReactProvider getLibrary={getLibrary}>
        <App />
      </Web3ReactProvider>
    </ChakraProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
