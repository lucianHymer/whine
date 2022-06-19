import React from "react";
import {
  Routes as ReactRoutes,
  Route,
  Navigate,
} from "react-router-dom";
import { faker } from "@faker-js/faker";

import {
  Heading,
  Text,
  VStack,
} from "@chakra-ui/react"

import MintForm from "./Routes/MintForm";
import Trade from "./Routes/Trade";

const UnderConstruction = () => {
  return (
    <VStack>
      <Heading>
        Under Construction
      </Heading>
      <Text>
        {faker.company.catchPhrase()}
      </Text>
    </VStack>
  );
};

const Routes = (props) => {
  return (
    <ReactRoutes>
      <Route
        path='/mint'
        element={<MintForm {...props} />}
      />
      <Route
        path='/trade'
        element={<Trade {...props} />}
      />
      <Route
        path='/redeem'
        element={<UnderConstruction {...props} />}
      />
      <Route
        path='*'
        element={<Navigate to='/mint' replace />}
      />
    </ReactRoutes>
  );
};

export default Routes;
