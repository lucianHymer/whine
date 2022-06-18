import React, { useState, useEffect } from "react";
import Whine from "./contracts/Whine.sol/Whine.json";
import WhineNetworks from "./contracts/Whine.sol/network.json";
import { useWeb3React } from '@web3-react/core'
import { ethers } from 'ethers'
import { addAxiosAuthenticatorMiddleware } from './axios_authenticator';
import { 
  Flex,
  Spacer,
} from '@chakra-ui/react';
import Body from './App/Body';
import Header from './App/Header';

const PAGES = ['Mint', 'Trade', 'Redeem']

const App = () => {
  const { account, chainId, library, error } = useWeb3React();
  const [ whineContract, setWhineContract ] = useState();

  useEffect( () => {
    if(account)
      addAxiosAuthenticatorMiddleware(account, library);
  }, [account, library]);

  useEffect( () => {
    try {
      if(error) console.log(error);

      if(library && !whineContract){
        console.log('Account', account);
        console.log('library', library);

        // Get the contract instance.
        const deployedNetwork = WhineNetworks.networks[chainId];
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
  }, [error, account, chainId, library, whineContract]);

  return (
    <Flex bg='background' h='100vh' direction='column'>
      <Header pages={PAGES} onPageChange={(page) => console.log('Page', page)}/>
      <Spacer />
      <Body whineContract={whineContract} />
      <Spacer />
    </Flex>
  );
};

export default App;
