import React, { useState, useEffect } from "react";
import Whine from "./contracts/Whine.sol/Whine.json";
import WhineNetworks from "./contracts/Whine.sol/network.json";
import { InjectedConnector } from "@web3-react/injected-connector";
import { useWeb3React } from '@web3-react/core'
import { ethers } from 'ethers'
import axios from 'axios';
import { addAxiosAuthenticatorMiddleware } from './axios_authenticator';
import { Flex, Spacer, VStack, Button, Center } from '@chakra-ui/react';

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
    <Flex h='100vh' direction='column'>
        <Flex h="10%">
          <Spacer />
          <Button m={2} size='md' onClick={() => activate(MetamaskWallet) }>
            Connect Wallet
          </Button>
        </Flex>
      <Spacer />
      <Center>
        <VStack>
          <label>Form</label>
          <Button size='md' onClick={() => mintNft(whineContract, account) }>
            Mint
          </Button>
        </VStack>
      </Center>
      <Spacer />
    </Flex>
  );
}

export default App;
