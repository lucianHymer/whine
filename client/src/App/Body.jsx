import React from "react";
import Routes from './Body/Routes';
import { 
  Center,
} from '@chakra-ui/react';

const NoWallet = () => {
  return (
    <Center h="100%">
      Please connect your MetaMask wallet
    </Center>
  );
};

const Body = (props) => {
  const { whineContract } = props;
  return (whineContract ?
    <Routes {...props} />
    :
    <NoWallet {...props} />
  );
};

export default Body;
