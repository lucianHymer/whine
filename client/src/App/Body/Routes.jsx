import React from "react";
import {
  Routes as ReactRoutes,
  Route,
  Navigate,
} from "react-router-dom";

import Mint from "./Routes/Mint";
import Trade from "./Routes/Trade";
import UnderConstruction from "./Routes/UnderConstruction";

const Routes = (props) => {
  return (
    <ReactRoutes>
      <Route
        path='/mint'
        element={<Mint {...props} />}
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
