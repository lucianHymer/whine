import React, { useRef, useEffect, useState } from "react";
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
  Slide,
  Button,
  useDisclosure,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerOverlay,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
} from '@chakra-ui/react';
import { useParams } from "react-router-dom";
import constants from 'constants';
import PageSwitch from "App/PageSwitch";
import UnderConstruction from "./UnderConstruction";
import { PlusSquareIcon } from "@chakra-ui/icons";
import LoadButton from "App/Body/LoadButton";
import { useMessages } from "Messages";

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

const useWhineList = () => {
  const { account, chainId } = useWeb3React();
  const [ chainData, setChainData ] = useState();
  const [ whineList, setWhineList ] = useState([]);

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

  return whineList;
};

// TODO add "Clear Selection", need to bump up highlight logic
const Sell = (props) => {
  const { whineContract } = props;
  const whineList = useWhineList();
  const [ selectedTokenIndices, setSelectedTokenIndices ] = useState([]);
  const [ showIntroText, setShowIntroText ] = useState(true);
  const [ showListPopup, setShowListPopup ] = useState(false);
  const [ pendingApproval, setPendingApproval ] = useState(false);
  const [ listPrice, setListPrice ] = useState(.05);
  const drawerControls = useDisclosure();
  const listButtonRef = useRef();
  const messages = useMessages();

  useEffect(() => {
    const timeout = setTimeout(
      () => setShowIntroText(false),
      5000
    );
    return () => clearTimeout(timeout);
  }, []);

  const handleSelectionChange = (selected, index) => {
    if(selected){
      setShowIntroText(false);
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

  const handleApprove = async () => {
    if(selectedTokenIndices.length){
      setPendingApproval(true);
      const tokens = whineList.filter( (whine, idx) => selectedTokenIndices.includes(idx) );
      const tokenIDs = tokens.map( token => parseInt(token.tokenID) );
      try {
        const tx = await whineContract.approveMultiple(constants.TREASURY_ADDRESS, tokenIDs);
        const txReceipt = await tx.wait();
        console.log('txReceipt', txReceipt);
        messages.success({description: "Listed WHINE for sale"});
        drawerControls.onClose();
      } catch (e) {
        messages.handleError(e);
      }
      setPendingApproval(false);
    }
  };

  useEffect( () => {
    if(selectedTokenIndices.length)
      setShowListPopup(true);
    else
      setShowListPopup(false);
  }, [selectedTokenIndices]);

  const listPriceInputProps = {
    min: 0,
    // max: 10,
    step: 0.01,
  };

  if(whineList.length)
    return (
      <>
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
        <Slide direction='bottom' in={showIntroText}>
          <Box
            p={1}
            color='white'
            bg='foreground'
            shadow='md'
            align='center'
            rounded='md'
          >
            Click one or more WHINE cards to select
          </Box>
        </Slide>
        <Slide direction='bottom' in={showListPopup}>
          <Center>
            <Button
              ref={listButtonRef}
              mb={3}
              p={8}
              w={[56, 72]}
              onClick={drawerControls.onOpen}
            >
              <PlusSquareIcon boxSize={8} mr={8}/>
              <Text fontSize={["lg", "2xl"]} as="span">
                List
                <Text px={1} as="span" color="secondary.main">
                  {selectedTokenIndices.length}
                </Text>
                token{selectedTokenIndices.length !== 1 && "s"}
              </Text>
            </Button>
          </Center>
        </Slide>
        <Drawer
          isOpen={drawerControls.isOpen}
          placement='right'
          onClose={drawerControls.onClose}
          finalFocusRef={listButtonRef}
        >
          <DrawerOverlay />
          <DrawerContent>
            <DrawerCloseButton />
            <DrawerHeader>List WHINE Tokens</DrawerHeader>
            <DrawerBody>
              <HStack mt={8} w='100%'>
                <Text whiteSpace="nowrap">
                  Token Price (eth): 
                </Text>
                <NumberInput
                  value={listPrice}
                  onChange={setListPrice}
                  {...listPriceInputProps}
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </HStack>
              <Text mt={16}>
                More controls to be added...
              </Text>
              {false && <Slider
                mt={4}
                focusThumbOnChange={false}
                onChange={setListPrice}
                value={listPrice}
                {...listPriceInputProps}
              >
                <SliderTrack>
                  <SliderFilledTrack />
                </SliderTrack>
                <SliderThumb
                  fontSize="sm"
                  boxSize="32px"
                  children={parseInt(listPrice)}
                />
              </Slider>
              }
            </DrawerBody>

            <DrawerFooter>
              <Button
                display={pendingApproval ? "none" : "inline-flex"}
                variant='outline'
                mr={3}
                onClick={drawerControls.onClose}
              >
                Cancel
              </Button>
              <LoadButton
                callback={handleApprove}
                showSpinner={pendingApproval}
                showButton={!pendingApproval}
                hideMessage={!pendingApproval}
                message="Approve the transaction in your wallet, then wait for it to go through"
                buttonText={`List ${selectedTokenIndices.length} Token${selectedTokenIndices.length !== 1 ? "s" : ""} for Sale`}
              />
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </>
    );
  else
    return (
      <Center h="100%">
        <Heading>Mint some WHINE, then view it here.</Heading>
      </Center>
    );
};

const Buy = (props) => {
  return <UnderConstruction />
};

const Trade = (props) => {
  const { whineContract } = props;
  const { mode } = useParams();

  return (
    <VStack h="100%" w="100%">
      <Heading mt={[0, null, null, -8]} pb={1} color='primary.main'>
        More WHINE?
      </Heading>
      <PageSwitch gap={2} h={10} pages={["Sell", "Buy"]} baseURL="/trade" />
      {mode === 'sell' ?
        <Sell whineContract={whineContract} /> :
        <Buy whineContract={whineContract} />
      }
    </VStack>
  );
};

export default Trade;
