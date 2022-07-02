import { useWeb3React } from '@web3-react/core'
import constants from 'constants'

const useEventListener = () => {
  const { library, chainId } = useWeb3React('data')

  const listen = filter => {
    return new Promise(outerResolve => {
      if (chainId === constants.HARDHAT_CHAIN_ID) {
        let listener
        new Promise(innerResolve => {
          library.once('block', num => {
            console.log('block', num)
            listener = (...eventArgs) => {
              const event = eventArgs[eventArgs.length - 1]
              console.log('event', event)
              if (event.blockNumber <= num) return
              innerResolve(eventArgs)
            }
            library.on(filter, listener)
          })
        }).then(eventArgs => {
          library.off(filter, listener)
          outerResolve(eventArgs)
        })
      } else {
        library.once(filter, (...eventArgs) => {
          const event = eventArgs[eventArgs.length - 1]
          console.log('onceevent', event)
          outerResolve(eventArgs)
        })
      }
    })
  }

  return listen
}

export { useEventListener }
