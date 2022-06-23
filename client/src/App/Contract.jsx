import { useWeb3React } from '@web3-react/core'

const useEventListener = () => {
  const { library } = useWeb3React();

  const listen = (contract, filter) => {
    // Can probably swap all this out for a simple "once"
    // in production. Seems to be a hardhat issue
    return new Promise( r => {
      library.once("block", (num) => {
        contract.on(filter, (...eventArgs) => {
          const event = eventArgs[eventArgs.length - 1];
          if(event.blockNumber <= num) return;
          r(eventArgs);
        });
      });
    });
  };

  return listen;
};

export { useEventListener };
