import React, { useState, useEffect } from "react";
import { abi as whineAbi } from "./contracts/Whine.sol/Whine.json";
import { networks as whineNetworks } from "./contracts/Whine.sol/network.json";
import { InjectedConnector } from "@web3-react/injected-connector";
import { useWeb3React } from '@web3-react/core'
import { ethers } from 'ethers'
import logo from './logo.svg';
import './App.css';
import axios from 'axios';
import { addAxiosAuthenticatorMiddleware } from './axios_authenticator';

const MetamaskWallet = new InjectedConnector({
  supportedChainIds: [31337],
});

function mintNft(whineContract, account){
  const metadata = {
    "name": "Whine",
    "description": "A Whine token redeemable for 1 wine bottle",
    "image": "ipfs://QmXVq2TDQVc4g6FzZCGXUmEu7MDkcAAGmGy83Eijnwt2mH/wineBottle.png",
    "properties": {
      "vintage": "2018",
      "varietal": "Varitas",
      "winery": "Epoch",
    }
  };
  axios.post('http://localhost:3001/create_nft_metadata', {
    metadata
  }).then(res => {
    console.log('res', res)
    whineContract.mintNft(account, res.data.ipfsHash, 300)
  }).catch(e => {
    console.log('Error creating NFT metadata', e)
  });
}

function App(){
  const { activate, account, chainId, library, error } = useWeb3React();
  const [ whineContract, setWhineContract ] = useState(null);

  useEffect( () => {
    if(account)
      addAxiosAuthenticatorMiddleware(account, library);
  }, [account]);

  useEffect( () => {
    try {
      if(error) console.log(error);

      if(library && !whineContract){
        console.log('Account', account);
        console.log('library', library);

        // Get the contract instance.
        const deployedNetwork = whineNetworks[chainId];
        setWhineContract(new ethers.Contract(
          deployedNetwork.address,
          whineAbi,
          library.getSigner(),
        ));
      }
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load ethers, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
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
        <button onClick={() => mintNft(whineContract, account) }>Mint</button>
        <br />
        {error ? error.message : ""}
      </header>
    </div>
  );
}

export default App;
