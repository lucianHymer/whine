import React, { useState, useEffect } from "react";
import { abi as whineAbi } from "./contracts/Greeter.sol/Greeter.json";
import { networks as whineNetworks } from "./contracts/Greeter.sol/network.json";
import { InjectedConnector } from "@web3-react/injected-connector";
import { useWeb3React } from '@web3-react/core'
import Web3 from 'web3'

import logo from './logo.svg';
import './App.css';

const MetamaskWallet = new InjectedConnector({
  supportedChainIds: [31337],
});

function App(){
  const { activate, account, chainId, library, error } = useWeb3React();
  const [ whineContract, setWhineContract ] = useState(null);
  const [ greeting, setGreeting ] = useState(null);

  useEffect( () => {
    (async () => {
      try {
        if(error) console.log(error);

        if(library && !whineContract){
          console.log('Account', account);
          console.log('Networks', whineNetworks);
          console.log('ABI', whineAbi);

          const web3 = new Web3(library.provider);

          // Get the contract instance.
          const deployedNetwork = whineNetworks[chainId];
          setWhineContract(new web3.eth.Contract(
            whineAbi,
            deployedNetwork && deployedNetwork.address,
          ));
        }
        if(whineContract) {
          const result = await whineContract.methods.greet().call({ from: account });
          setGreeting(result);
        }
      } catch (error) {
        // Catch any errors for any of the above operations.
        alert(
          `Failed to load web3, accounts, or contract. Check console for details.`,
        );
      console.error(error);
      }
    })();
  }, [error, account, chainId, library, whineContract]);


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
        <br />
        Greeting: {greeting || (error ? error.message : null)}
      </header>
    </div>
  );
}

export default App;
