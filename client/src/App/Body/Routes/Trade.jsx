import React, { useEffect, useState } from "react";
import axios from 'axios';
import { useWeb3React } from '@web3-react/core'
import { 
  VStack,
  HStack,
  Text,
  Box,
  Image,
} from '@chakra-ui/react';

import Card from "../Card";

import { initializeChainData } from "Adapters/ChainData";

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
    <Card>
      <VStack>
        <Image boxSize={52} fit='contain' src='https://gateway.pinata.cloud/ipfs/QmXVq2TDQVc4g6FzZCGXUmEu7MDkcAAGmGy83Eijnwt2mH/wineBottle.png' />
        <HStack>
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
      setWhineList(chainData.getWhineForAddress(account, 5));
      return () => setWhineList([]);
    }
  }, [chainData, account]);


  return (
    <HStack>
      {whineList.map(whine => <Whine
        key={whine.id}
        {...whine}
        showRoyalties
      />)}
    </HStack>
  );
};

export default Trade;
