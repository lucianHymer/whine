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
  <Text p={LINE_SPACING} {...props}>
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
    <VStack {...props}>
      <Image height={200} src='https://gateway.pinata.cloud/ipfs/QmXVq2TDQVc4g6FzZCGXUmEu7MDkcAAGmGy83Eijnwt2mH/wineBottle.png' />
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
          {showRoyalties && <Value>{royalties}</Value>}
        </Box>
      </HStack>
    </VStack>
  );
};

const Trade = () => {
  return (
    <Card>
      <VStack align="left">
        <Whine
          winery="Lucian's Winery"
          vintage="2021"
          varietal="Pinot Noir"
          royalties="3.00%"
          showRoyalties
        />
      </VStack>
    </Card>
  );
};

export default Trade;
