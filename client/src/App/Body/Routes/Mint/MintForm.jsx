import React, { useState } from "react";
import axios from 'axios';
import { useWeb3React } from '@web3-react/core'
import { 
  Input,
  FormLabel,
  FormControl,
} from '@chakra-ui/react';

import constants from 'constants';
import RoyaltiesField from './MintForm/RoyaltiesField';
import VintageField from './MintForm/VintageField';
import { useMessages } from 'Messages';
import LoadButton from "App/Body/LoadButton";
import { useEventListener } from "App/Contract";

const MintForm = (props) => {
  const { whineContract, winery } = props;
  const { account } = useWeb3React();
  const [ varietal, setVarietal ] = useState('');
  const [ vintage, setVintage ] = useState(new Date().getUTCFullYear());
  const [ royalties, setRoyalties ] = useState('3.00');
  const [ pending, setPending ] = useState(false);
  const Messages = useMessages();
  const listen = useEventListener();

  const handleSubmit = (event) => {
    event.preventDefault();
    setPending(true);
    console.log('Submitted');
    mintNft();
  };

  const mintNft = () => {
    const metadata = {
      name: "Whine",
      description: "A Whine token redeemable for 1 wine bottle",
      image: "ipfs://QmXVq2TDQVc4g6FzZCGXUmEu7MDkcAAGmGy83Eijnwt2mH/wineBottle.png",
      properties: {vintage, varietal, winery}
    };
    axios.post(`${constants.BACKEND_URL}/create_nft_metadata`, {
      metadata
    }).then(res => {
      return whineContract.mintNft(account, res.data.ipfsHash, parseInt(parseFloat(royalties)*100));
    }).then(res => {
      const filter = whineContract.filters.Transfer(constants.ZERO_ADDRESS, account);
      return listen(whineContract, filter)
    }).then( (from, to, val, event) => {
      console.log('Listened', from, to, val, event);
      setPending(false);
      Messages.success({title: "Successfully minted some WHINE"});
    }).catch(e => {
      Messages.error({
        title: 'Error creating NFT',
        description: e?.error?.data?.message || e?.message,
      });
      console.log('Error creating NFT', e)
      setPending(false);
    });
  }

  return (
    <form align='center' onSubmit={handleSubmit}>
      <FormControl isRequired isReadOnly>
        <FormLabel requiredIndicator='' htmlFor='winery'>Winery</FormLabel>
        <Input id='winery' variant='filled' size='sm' value={winery} />
      </FormControl>
      <FormControl isRequired mt={4}>
        <FormLabel requiredIndicator='' htmlFor='varietal'>Varietal</FormLabel>
        <Input
          id='varietal'
          size='sm'
          placeholder="Pinot Noir"
          value={varietal}
          onChange={(event) => setVarietal(event.target.value)}
        />
      </FormControl>
      <VintageField vintage={vintage} setVintage={setVintage} />
      <RoyaltiesField royalties={royalties} setRoyalties={setRoyalties} />
      <LoadButton
        mt={6}
        buttonText='Mint'
        pending={pending}
      />
    </form>
  );
};

export default MintForm;
