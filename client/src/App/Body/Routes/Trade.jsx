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
import { useParams } from "react-router-dom";
import constants from 'constants';
import PageSwitch from "App/PageSwitch";

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
    index,
    winery,
    varietal,
    vintage,
    royalties,
    showRoyalties,
    image,
    selectedCallback,
  } = props;

  const [selected, setSelected] = useState(false);

  useEffect( () => {
    if(selectedCallback)
      selectedCallback(selected, index);
  }, [selected, selectedCallback, index]);

  const handleClick = (event) => {
    event.preventDefault();
    setSelected(!selected)
  };

  const imageSrc = image && `https://gateway.pinata.cloud/ipfs/${image.replace(/^\s*ipfs:\/\//,'')}`;

  return (
    <Card p={[1, 2, 3]} selected={selected} onClick={handleClick}>
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

const Sell = (props) => {
  const { account, chainId } = useWeb3React();
  const [ chainData, setChainData ] = useState();
  const [ whineList, setWhineList ] = useState([]);
  const [ selectedTokenIndices, setSelectedTokenIndices ] = useState([]);

  useEffect(() => {
    setChainData(initializeChainData(chainId === constants.HARDHAT_CHAIN_ID || 'graph'));
    return () => setChainData(null);
  }, [chainId]);

  useEffect(() => {
    const fetchData = async () => {
      if(chainData && account){
        setWhineList(await chainData.getWhineForAddress(account, 8));
      }
    }
    fetchData();
    if(chainData && account){
      return () => setWhineList([]);
    }
  }, [chainData, account]);

  const handleSelectionChange = (selected, index) => {
    if(selected){
      if(!selectedTokenIndices.includes(index))
      setSelectedTokenIndices(indices => [...indices, index]);
    } else {
      const arrayLoc = selectedTokenIndices.indexOf(index);
      if(arrayLoc > -1)
        setSelectedTokenIndices(indices =>
          [...indices.slice(0, arrayLoc), ...indices.slice(arrayLoc + 1)]
        );
    }
  };

  if(whineList.length)
    return (
      <Wrap justify='center' overflowY="scroll" h="100%" w="100%" pb={1} px={3}>
        {whineList.map( (whine, index) => <WrapItem key={whine.id}>
          <Whine
            {...whine}
            index={index}
            selectedCallback={handleSelectionChange}
            showRoyalties
          />
        </WrapItem>)}
      </Wrap>
    );
  else
    return (
      <Center h="100%">
        <Heading>Mint some WHINE, then view it here.</Heading>
      </Center>
    );
};

const Buy = (props) => {
};

const Trade = (props) => {
  const { mode } = useParams();

  return (
    <VStack h="100%" w="100%">
      <Heading mt={[0, null, null, -8]} pb={1} color='primary.main'>
        More WHINE?
      </Heading>
      <PageSwitch gap={2} h={10} pages={["Sell", "Buy"]} baseURL="/trade" />
      {mode === 'sell' ? <Sell /> : <Buy />}
    </VStack>
  );
};

export default Trade;
