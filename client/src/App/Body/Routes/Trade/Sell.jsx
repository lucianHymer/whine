import React, { useRef, useEffect, useState } from "react";
import { useWeb3React } from '@web3-react/core'
import { 
  Center,
  HStack,
  Text,
  Box,
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
} from '@chakra-ui/react';
import constants from 'constants';
import { PlusSquareIcon } from "@chakra-ui/icons";
import LoadButton from "App/Body/LoadButton";
import { useMessages } from "Messages";

import Whine from "./Whine";

import { initializeChainData } from "Adapters/ChainData";

const useWineFromChain = () => {
  const { account, chainId } = useWeb3React();
  const [ chainData, setChainData ] = useState();
  const [ whineList, setWhineList ] = useState([]);

  useEffect(() => {
    setChainData(initializeChainData(chainId === constants.HARDHAT_CHAIN_ID || 'graph'));
    return () => setChainData(null);
  }, [chainId]);

  useEffect(() => {
    (async () => {
      if(chainData && account){
        setWhineList(await chainData.getWhineForAddress(account, 8));
      }
    })();
    if(chainData && account){
      return () => setWhineList([]);
    }
  }, [chainData, account]);

  return whineList;
};

const SellDrawer = (props) => {
  const {
    whineList,
    selectedTokenIndices,
    listButtonRef,
    whineContract,
    drawerControls,
  } = props;

  const [ pendingApproval, setPendingApproval ] = useState(false);
  const [ listPrice, setListPrice ] = useState(.05);
  const messages = useMessages();

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
  return (
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
              min={0}
              step={0.01}
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
  );
};

// TODO add "Clear Selection", need to bump up highlight logic
const Sell = (props) => {
  const { whineContract } = props;
  const whineList = useWineFromChain();
  const [ selectedTokenIndices, setSelectedTokenIndices ] = useState([]);
  const [ showIntroText, setShowIntroText ] = useState(true);
  const [ showListPopup, setShowListPopup ] = useState(false);
  const drawerControls = useDisclosure();
  const listButtonRef = useRef();

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
      if(
        !whineList[index].listed &&
        !selectedTokenIndices.includes(index)
      )
        setSelectedTokenIndices(indices => [...indices, index]);
    } else {
      const arrayLoc = selectedTokenIndices.indexOf(index);
      if(arrayLoc > -1)
        setSelectedTokenIndices(indices =>
          [...indices.slice(0, arrayLoc), ...indices.slice(arrayLoc + 1)]
        );
    }
  };

  useEffect( () => {
    if(selectedTokenIndices.length)
      setShowListPopup(true);
    else
      setShowListPopup(false);
  }, [selectedTokenIndices]);

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
        <SellDrawer
          whineList={whineList}
          whineContract={whineContract}
          listButtonRef={listButtonRef}
          drawerControls={drawerControls}
          selectedTokenIndices={selectedTokenIndices}
        />
      </>
    );
  else
    return (
      <Center h="100%">
        <Heading>Mint some WHINE, then view it here.</Heading>
      </Center>
    );
};

export default Sell;
