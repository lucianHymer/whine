import constants from './whineConstants'
import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'
import reportWebVitals from './reportWebVitals'
import { Web3ReactProvider, createWeb3ReactRoot } from '@web3-react/core'
import { InfuraProvider, Web3Provider } from '@ethersproject/providers'
import { BrowserRouter, HashRouter } from 'react-router-dom'
import { ChakraProvider } from '@chakra-ui/react'
import theme from './theme'
import { MessagesProvider } from './Messages'

import '@fontsource/kanit/400.css'
import '@fontsource/kanit/700.css'

function getMetamaskLibrary (provider) {
  return new Web3Provider(provider)
}

function getDataLibrary (provider) {
  const chainId = parseInt(provider.networkVersion)
  if (chainId === constants.HARDHAT_CHAIN_ID) {
    return getMetamaskLibrary(provider)
  }

  return InfuraProvider.getWebSocketProvider(
    chainId,
    '73a3b253ac9a43c5ad79ace7abebfcd9'
  )
}

const Router = constants.IS_GITHUB_PAGES ? HashRouter : BrowserRouter

const Web3ReactDataProvider = createWeb3ReactRoot('data')

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <React.StrictMode>
    <MessagesProvider>
      <ChakraProvider theme={theme}>
        <Web3ReactProvider getLibrary={getMetamaskLibrary}>
          <Web3ReactDataProvider getLibrary={getDataLibrary}>
            <Router>
              <App />
            </Router>
          </Web3ReactDataProvider>
        </Web3ReactProvider>
      </ChakraProvider>
    </MessagesProvider>
  </React.StrictMode>
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
