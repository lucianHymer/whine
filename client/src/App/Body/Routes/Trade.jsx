import React, { useEffect, useState } from "react";
import { useWeb3React } from '@web3-react/core'
import { 
  VStack,
  HStack,
  Text,
  Box,
  Image,
  Wrap,
  WrapItem,
  Heading,
} from '@chakra-ui/react';

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
  } = props;

  return (
    <Card p={[1, 2, 3]}>
      <VStack>
        <Image boxSize={[28, 36, 48]} fit='contain' src='https://gateway.pinata.cloud/ipfs/QmXVq2TDQVc4g6FzZCGXUmEu7MDkcAAGmGy83Eijnwt2mH/wineBottle.png' />
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
                <Value>{Math.round(royalties * 100)}%</Value>
            }
          </Box>
        </HStack>
      </VStack>
    </Card>
  );
};

const Trade = () => {
  const { account } = useWeb3React();
  const [ chainData, setChainData ] = useState();
  const [ whineList, setWhineList ] = useState([]);

  useEffect(() => {
    setChainData(initializeChainData());
    return () => setChainData(null);
  }, []);

  useEffect(() => {
    if(chainData && account){
      setWhineList(chainData.getWhineForAddress(account, 3));
      return () => setWhineList([]);
    }
  }, [chainData, account]);


  return (
    <VStack h="100%" w="100%">
      <Heading mt={[0, null, null, -8]} pb={1} color='primary.main'>
        More WHINE?
      </Heading>
      <Wrap overflowY="scroll" h="100%" w="100%" pb={1} px={3}>
        {whineList.map(whine => <WrapItem key={whine.id}>
          <Whine
            {...whine}
            showRoyalties
          />
        </WrapItem>)}
      </Wrap>
    </VStack>
  );
};

export default Trade;
