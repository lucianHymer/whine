import React from "react";
import MintForm from "./Body/MintForm";
import { 
  Flex,
  Spacer,
} from '@chakra-ui/react';

const Body = ({whineContract}) => {
  return (
    <Flex>
      <Spacer />
      {
        whineContract ?
          <MintForm whineContract={whineContract} />
          :
          "Please connect your wallet"
      }
      <Spacer />
    </Flex>
  );
};

export default Body;
