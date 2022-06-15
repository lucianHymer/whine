import React, { useEffect, useState } from "react";
import axios from 'axios';
import { useWeb3React } from '@web3-react/core'
import { 
  Box,
  Button,
  Input,
  FormLabel,
  FormControl,
  InputGroup,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from '@chakra-ui/react';

const RoyaltiesField = ({}) => {
  const format = (val) => val + '%';
  const parse = (val) => val.replace(/\s*%\s*$/).trim()

  const [royalties, setRoyalties] = useState('3.00');

  return (
    <FormControl isRequired mt={4}>
      <FormLabel requiredIndicator='' htmlFor='royalties'>Royalties</FormLabel>
      <InputGroup size='sm'>
        <NumberInput
          w='100%'
          value={format(royalties)}
          onChange={valStr => setRoyalties(parse(valStr))}
          id='royalties'
          step={0.1}
          defaultValue={3}
          precision={2}
          min={0}
          max={50}
        >
          <NumberInputField />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>
      </InputGroup>
    </FormControl>
  );
};

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
  const [ wineryName, setWineryName ] = useState();
  const [ loaded, setLoaded ] = useState(false);

  useEffect( () => {
    if(account && !loaded){
      whineContract.getRegisteredWineryName(account).then( name => {
        setWineryName(name);
        setLoaded(true);
      });
    }
    return () => {
      if(loaded){
        setWineryName(null);
        setLoaded(false);
      }
    };
  }, [whineContract, account, loaded]);

  if(!loaded){
    return "Looking for registered winery...";
  } else if(!wineryName){
    return "Winery not registered";
  }

  return (
    <Box p={5} rounded='xl' border='2px' borderColor='purple.300' width='30%' boxShadow='lg' bg='white'>
      <form align='center'>
        <FormControl isRequired isReadOnly>
          <FormLabel requiredIndicator='' htmlFor='winery'>Winery</FormLabel>
          <Input id='winery' variant='filled' size='sm' value={wineryName} />
        </FormControl>
        <FormControl isRequired mt={4}>
          <FormLabel requiredIndicator='' htmlFor='varietal'>Varietal</FormLabel>
          <Input id='varietal' size='sm' placeholder="Pinot Noir" />
        </FormControl>
        <FormControl isRequired mt={4}>
          <FormLabel requiredIndicator='' htmlFor='vintage'>Vintage</FormLabel>
          <Input id='vintage' size='sm' placeholder={new Date().getUTCFullYear()} />
        </FormControl>
        <RoyaltiesField />
        <Button type='submit' mt={6} size='md' onClick={() => mintNft(whineContract, account) }>
          Mint
        </Button>
      </form>
    </Box>
  );
};

export default MintForm;
