import React, { useState, useEffect, useRef } from "react";
import Whine from "./contracts/Whine.sol/Whine.json";
import { useWeb3React } from '@web3-react/core'
import { ethers } from 'ethers'
import { addAxiosAuthenticatorMiddleware } from './axios_authenticator';
import { 
  Box,
} from '@chakra-ui/react';
import Body from './App/Body';
import Header from './App/Header';
import { useMessages } from 'Messages';

const PAGES = ['Mint', 'Trade', 'Redeem']

const usePrevious = (value) => {
  const ref = useRef();
  useEffect( () => { ref.current = value });
  return ref.current;
};

const App = () => {
  const { account, chainId, library, error } = useWeb3React();
  const [ whineContract, setWhineContract ] = useState();
  const previousAccount = usePrevious(account);
  const previousChainId = usePrevious(chainId);
  const messages = useMessages();

  useEffect( () => {
    // TODO see what happens with this when switching accounts
    if(account){
      addAxiosAuthenticatorMiddleware(account, library, (errorMessage) => {
        messages.error({
          title: "Auth Error",
          description: errorMessage,
        });
      }, () => {
        messages.info({
          title: "Please Approve MetaMask Signature",
          description: "This allows for anonymous, secure authentication with our backend",
          duration: 20000, }); });
    }
  }, [account, library, messages]);

  useEffect( () => {
    try {
      if(error) console.log(error);
      // Probably want to get rid of this IF stuff and
      // make this happen any time the web3react stuff changes
      if(library && (
        !whineContract || (
          account !== previousAccount ||
          chainId !== previousChainId
        ))) {
        console.log('Account', account);
        console.log('library', library);

        const deployedNetwork = Whine.networks[chainId];
        setWhineContract(new ethers.Contract(
          deployedNetwork.address,
          Whine.abi,
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
  }, [error, account, chainId, library, whineContract, previousAccount, previousChainId]);

  return (
    <Box bg='background' h='100vh'>
      <Box h='7vh'>
        <Header pages={PAGES} />
      </Box>
      <Box h='93vh'>
        <Body whineContract={whineContract} />
      </Box>
    </Box>
  );
};

export default App;
