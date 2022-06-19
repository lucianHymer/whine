import React from "react";
import { 
  Center,
  Flex,
  Spacer,
} from '@chakra-ui/react';
import Routes from './Body/Routes';

const NoWallet = () => {
  return "Please connect your MetaMask wallet";
};

const Body = (props) => {
  const { whineContract } = props;
  return (
    <Flex h='100%' align='center' direction='column'>
      <Spacer />
      {
        whineContract ?
          <Routes {...props} />
          :
          <NoWallet {...props} />
      }
      <Spacer />
    </Flex>
  );
};

export default Body;
