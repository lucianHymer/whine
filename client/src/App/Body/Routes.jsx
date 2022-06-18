import React from "react";
import {
  Routes as ReactRoutes,
  Route,
  Navigate,
} from "react-router-dom";

import MintForm from "./Routes/MintForm";
import Trade from "./Routes/Trade";

const UnderConstruction = () => {
  return "Under Construction"
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
