import React from "react";
import { 
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
    <Flex>
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
