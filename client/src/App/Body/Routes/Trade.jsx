import React, { useEffect, useState } from "react";
import axios from 'axios';
import { useWeb3React } from '@web3-react/core'
import { 
  VStack,
  Text,
} from '@chakra-ui/react';

import Card from "../Card";

const Trade = () => {
  return (
    <Card width="20%" p={2}>
      <VStack align="left">
        <Text>Winery: Lucian's Winery</Text>
        <Text>Vintage: 2021</Text>
      </VStack>
    </Card>
  );
};

export default Trade;
