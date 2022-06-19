import React, { useEffect, useState } from "react";
import axios from 'axios';
import { useWeb3React } from '@web3-react/core'
import { 
  Box,
  Button,
  Input,
  FormLabel,
  FormControl,
} from '@chakra-ui/react';

import Card from '../Card';
import RoyaltiesField from './MintForm/RoyaltiesField';
import VintageField from './MintForm/VintageField';

const MintForm = ({whineContract}) => {
  const { account } = useWeb3React();
  const [ winery, setWinery ] = useState();
  const [ loaded, setLoaded ] = useState(false);
  const [ varietal, setVarietal ] = useState('');
  const [ vintage, setVintage ] = useState(new Date().getUTCFullYear());
  const [ royalties, setRoyalties ] = useState('3.00');

  useEffect( () => {
    if(account && !loaded){
      whineContract.getRegisteredWineryName(account).then( name => {
        setWinery(name);
        setLoaded(true);
      });
    }
    return () => {
      if(loaded){
        setWinery(null);
        setLoaded(false);
      }
    };
  }, [whineContract, account, loaded]);

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

    axios.post('http://localhost:3001/create_nft_metadata', {
      metadata
    }).then(res => {
      console.log('res', res)
      whineContract.mintNft(account, res.data.ipfsHash, parseInt(parseFloat(royalties)*100))
    }).catch(e => {
      console.log('Error creating NFT', e)
    });
  }

  if(!loaded){
    return "Looking for registered winery...";
  } else if(!winery){
    return "Winery not registered";
  }

  return (
    <Card h="min-content" w={['70%', '50%', 'null', '30%']}>
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
    </Card>
  );
};

export default MintForm;
