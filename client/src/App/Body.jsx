import React from 'react'
import Routes from './Body/Routes'
import { Center } from '@chakra-ui/react'
import { useContracts } from './Contract'

const NoWallet = () => {
  return (
    <Center h='100%'>
      Please connect your MetaMask wallet on the Goerli testnet
    </Center>
  )
}

const Body = props => {
  const { whineContract } = useContracts()
  return whineContract ? <Routes {...props} /> : <NoWallet {...props} />
}

export default Body
