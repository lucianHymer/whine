import React, { useState, useEffect } from "react";
import { useWeb3React } from '@web3-react/core'
import { ethers } from 'ethers'

const EthersAuthenticator = (props) => {
  const { account, chainId, library, error } = useWeb3React();
  const [ authenticated, setAuthenticated ] = useState(false);

  const signAndSendMessage = async (message) => {
    const signer = library.getSigner();
    const signedMessage = await signer.signMessage(message);
    fetch(`http://localhost:3001/authenticate/${account}`, {
      method: 'POST',
      body: JSON.stringify({signedMessage}),
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    }).then(res => res.json())
      .then(
        (result) => {
          console.log('Logged in');
          setAuthenticated(true);
        },
        (error) => {
          console.log('Error authenticating', error);
        }
      )
  };

  useEffect( () => {
    if(account && !authenticated){
      alert(
        "Metamask will request that you sign a message. " +
        "This is a free (no gas), secure, anonymous way to authenticate messages to our backend"
      );
      fetch(`http://localhost:3001/auth_message/${account}`)
        .then(res => res.json())
        .then(
          (result) => signAndSendMessage(result.message),
          (error) => console.log('Error fetching auth message', error)
        )
    }
  }, [account, authenticated]);
};

export default EthersAuthenticator;
