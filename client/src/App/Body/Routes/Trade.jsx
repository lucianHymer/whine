import React, { useEffect, useState } from "react";
import { useWeb3React } from '@web3-react/core'
import { 
  Center,
  VStack,
  HStack,
  Text,
  Box,
  Image,
  Wrap,
  WrapItem,
  Heading,
} from '@chakra-ui/react';
import constants from 'constants';

import Card from "../Card";

import { initializeChainData } from "../../../Adapters/ChainData";

const LINE_SPACING = 1;

const Label = (props) => {
  return (
  <Text fontWeight='bold' p={LINE_SPACING} {...props}>
    {props.children}
  </Text>
  );
};

const Value = (props) => {
  return (
  <Text whiteSpace="nowrap" p={LINE_SPACING} {...props}>
    {props.children}
  </Text>
  );
};

const Whine = (props) => {
  const {
    winery,
    varietal,
    vintage,
    royalties,
    showRoyalties,
    image,
  } = props;

  const imageSrc = image && `https://gateway.pinata.cloud/ipfs/${image.replace(/^\s*ipfs:\/\//,'')}`;

  return (
    <Card p={[1, 2, 3]}>
      <VStack>
        <Image
          boxSize={[28, 36, 48]}
          fit='contain'
          src={imageSrc}
        />
        <HStack fontSize={['xs', 'sm', 'md']}>
          <Box align='center'>
            <Label>Winery</Label>
            <Label>Vintage</Label>
            <Label>Varietal</Label>
            {showRoyalties && <Label>Royalties</Label>}
          </Box>
          <Box align='center'>
            <Value>{winery}</Value>
            <Value>{vintage}</Value>
            <Value>{varietal}</Value>
            {
              showRoyalties &&
                <Value>{(royalties / 100).toFixed(2)}%</Value>
            }
          </Box>
        </HStack>
      </VStack>
    </Card>
  );
};

const Trade = () => {
  const { account, chainId } = useWeb3React();
  const [ chainData, setChainData ] = useState();
  const [ whineList, setWhineList ] = useState([]);

  useEffect(() => {
    console.log('cid', chainId, chainId === constants.HARDHAT_CHAIN_ID);
    setChainData(initializeChainData(chainId === constants.HARDHAT_CHAIN_ID || 'graph'));
    return () => setChainData(null);
  }, [chainId]);

  useEffect(() => {
    const fetchData = async () => {
      if(chainData && account){
        setWhineList(await chainData.getWhineForAddress(account, 5));
      }
    }
    fetchData();
    if(chainData && account){
      return () => setWhineList([]);
    }
  }, [chainData, account]);

  useEffect( () => console.log(whineList), [whineList]);


  return (
    <VStack h="100%" w="100%">
      <Heading mt={[0, null, null, -8]} pb={1} color='primary.main'>
        More WHINE?
      </Heading>
      {whineList.length || <Center h="100%"><Heading>Mint some WHINE, then view it here.</Heading></Center>}
      {whineList.length &&
        <Wrap justify='center' overflowY="scroll" h="100%" w="100%" pb={1} px={3}>
          {whineList.map(whine => <WrapItem key={whine.id}>
            <Whine
              {...whine}
              showRoyalties
            />
          </WrapItem>)}
        </Wrap>
      }
    </VStack>
  );
};

export default Trade;
