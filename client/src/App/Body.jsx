import React from "react";
import MintForm from "./Body/MintForm";
import { 
  Flex,
  Spacer,
} from '@chakra-ui/react';
import {
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

const UnderConstruction = () => {
  return "Under Construction"
};

const Body = ({whineContract}) => {
  return (
    <Flex>
      <Spacer />
      {
        whineContract ?
          <Routes>
            <Route
              path='/mint'
              element={<MintForm whineContract={whineContract} />}
            />
            <Route
              path='/trade'
              element={<UnderConstruction />}
            />
            <Route
              path='/redeem'
              element={<UnderConstruction />}
            />
            <Route path='*' element={<Navigate to='/mint' replace />} />
          </Routes>
          :
          "Please connect your MetaMask wallet"
      }
      <Spacer />
    </Flex>
  );
};

export default Body;
