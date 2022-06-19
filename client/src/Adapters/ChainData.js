import TestChainData from "./ChainData/TestChainData";

export const initializeChainData = (interfaceName) => {
  let interfaceLibrary;

  switch(interfaceName){
    default:
      interfaceLibrary = TestChainData;
  }

  return interfaceLibrary;
};
