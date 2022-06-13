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
      <MintForm whineContract={whineContract} />
      <Spacer />
    </Flex>
  );
};

export default Body;
