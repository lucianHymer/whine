import { useEffect, createContext, useContext, useState, useRef } from 'react'
import { useWeb3React } from '@web3-react/core'
import constants from 'whineConstants'
import { ethers } from 'ethers'
import Whine from '../contracts/Whine.sol/Whine.json'
import WhineMarket from '../contracts/WhineMarket.sol/WhineMarket.json'

const Contract = createContext({})

const usePrevious = value => {
  const ref = useRef()
  useEffect(() => {
    ref.current = value
  })
  return ref.current
}

const ContractProvider = props => {
  const { account, chainId, library, error } = useWeb3React()
  const previousAccount = usePrevious(account)
  const previousChainId = usePrevious(chainId)
  const [whineContract, setWhineContract] = useState()
  const [whineMarketContract, setWhineMarketContract] = useState()

  useEffect(() => {
    try {
      if (error) console.log(error)
      // Probably want to get rid of this IF stuff and
      // make this happen any time the web3react stuff changes
      if (
        library &&
        (!whineContract ||
          account !== previousAccount ||
          chainId !== previousChainId)
      ) {
        console.log('Account', account)
        console.log('library', library)

        const whineAddress = Whine.networks[chainId].address
        setWhineContract(
          new ethers.Contract(whineAddress, Whine.abi, library.getSigner())
        )

        const whineMarketAddress = WhineMarket.networks[chainId].address
        setWhineMarketContract(
          new ethers.Contract(
            whineMarketAddress,
            WhineMarket.abi,
            library.getSigner()
          )
        )
      }
    } catch (error) {
      // Catch any errors for any of the above operations.
      window.alert(
        'Failed to load ethers, accounts, or contract. Check console for details.'
      )
      console.error(error)
    }
  }, [
    error,
    account,
    chainId,
    library,
    whineContract,
    previousAccount,
    previousChainId
  ])

  return (
    <Contract.Provider value={{ whineContract, whineMarketContract }}>
      {props.children}
    </Contract.Provider>
  )
}

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

const useContracts = () => useContext(Contract)

export { ContractProvider, useEventListener, useContracts }
