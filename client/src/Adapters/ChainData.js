import TestChainData from "./ChainData/TestChainData";
import GraphChainData from "./ChainData/GraphChainData";

export const initializeChainData = (interfaceName) => {
  let interfaceLibrary;

  switch(interfaceName){
    case 'graph':
      interfaceLibrary = GraphChainData;
      break;
    default:
      interfaceLibrary = TestChainData;
  }

  return interfaceLibrary;
};
