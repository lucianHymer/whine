import React from "react";
import axios from 'axios';
import { useWeb3React } from '@web3-react/core'
import { 
  Box,
  Button,
  Input,
  FormLabel,
  FormControl,
} from '@chakra-ui/react';

function mintNft(whineContract, account){
  const metadata = {
    "name": "Whine",
    "description": "A Whine token redeemable for 1 wine bottle",
    "image": "ipfs://QmXVq2TDQVc4g6FzZCGXUmEu7MDkcAAGmGy83Eijnwt2mH/wineBottle.png",
    "properties": {
      "vintage": "2019",
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

const MintForm = ({whineContract}) => {
  const { account } = useWeb3React();

  return (
    <Box direction='row' p={5} rounded='xl' border='2px' borderColor='purple.300' width='30%' boxShadow='lg' bg='white'>
      <form align='center'>
        <FormControl isRequired>
          <FormLabel requiredIndicator='' htmlFor='varietal'>Varietal</FormLabel>
          <Input id='varietal' size='sm' placeholder="Pinot Noir"/>
        </FormControl>
        <FormControl isRequired>
          <FormLabel requiredIndicator='' htmlFor='vintage'>Vintage</FormLabel>
          <Input id='vintage' size='sm' placeholder={new Date().getUTCFullYear()}/>
        </FormControl>
        <Button type='submit' mt={4} size='md' onClick={() => mintNft(whineContract, account) }>
          Mint
        </Button>
      </form>
    </Box>
  );
};

export default MintForm;
