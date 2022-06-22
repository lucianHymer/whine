import React, { useState } from "react";
import axios from 'axios';
import { useWeb3React } from '@web3-react/core'
import { 
  Button,
  Input,
  FormLabel,
  FormControl,
} from '@chakra-ui/react';

import constants from 'constants';
import RoyaltiesField from './MintForm/RoyaltiesField';
import VintageField from './MintForm/VintageField';
import { useMessages } from 'Messages';

const MintForm = (props) => {
  const { whineContract, winery } = props;
  const { account } = useWeb3React();
  const [ varietal, setVarietal ] = useState('');
  const [ vintage, setVintage ] = useState(new Date().getUTCFullYear());
  const [ royalties, setRoyalties ] = useState('3.00');
  const Messages = useMessages();

  const handleSubmit = (event) => {
    event.preventDefault();
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
      console.log('res', res)
      return whineContract.mintNft(account, res.data.ipfsHash, parseInt(parseFloat(royalties)*100))
    }).catch(e => {
      Messages.error({
        title: 'Error creating NFT',
        description: e?.error?.data?.message,
      });
      console.log('Error creating NFT', e)
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
      <Button type='submit' mt={6} size='md'>
        Mint
      </Button>
    </form>
  );
};

export default MintForm;
