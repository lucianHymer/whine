import React, { useState, useEffect } from "react";
import Whine from "./contracts/Greeter.sol/Greeter.json";
import { InjectedConnector } from "@web3-react/injected-connector";
import { useWeb3React } from '@web3-react/core'
import Web3 from 'web3'

import logo from './logo.svg';
import './App.css';

const MetamaskWallet = new InjectedConnector({
  supportedChainIds: ['31337'],
});

function App() {
  const { activate, account, chainId, library } = useWeb3React();
  const [ whineContract, setWhineContract ] = useState(null);

  useEffect( () => {
    try {
      if(library){
        console.log('Account', account);

        const web3 = new Web3(library.provider);

        // Get the contract instance.
        const deployedNetwork = Whine.networks[chainId];
        setWhineContract(new web3.eth.Contract(
          Whine.abi,
          deployedNetwork && deployedNetwork.address,
        ));
      }
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
    console.error(error);
    }
  }, [account, chainId, library]);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <br />
        <button onClick={() => activate(MetamaskWallet) }>Connect Metamask Wallet</button>
      </header>
    </div>
  );
}

export default App;
