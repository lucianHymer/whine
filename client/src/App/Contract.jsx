import { useWeb3React } from '@web3-react/core';
import constants  from 'constants';

const useEventListener = () => {
  const { library, chainId } = useWeb3React();

  const listen = (contract, filter) => {
    return new Promise( outerResolve => {
      let listener;
      new Promise( innerResolve => {
        library.once("block", (num) => {
          console.log('block', num);
          listener = (...eventArgs) => {
            const event = eventArgs[eventArgs.length - 1];
            console.log('event', event);
            if(event.blockNumber <= num) return;
            innerResolve(eventArgs);
          };
          contract.on(filter, listener);
        });
      }).then((eventArgs) => {
        contract.off(filter, listener);
        outerResolve(eventArgs);
      });
    });
  };

  return listen;
};

export { useEventListener };
