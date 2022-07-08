import React, { useEffect, useState } from 'react'
import { useWeb3React } from '@web3-react/core'
import { Center } from '@chakra-ui/react'

import Card from '../Card'
import MintForm from './Mint/MintForm'
import WineryRegisterForm from './Mint/WineryRegisterForm'
import { useContracts } from 'App/Contract'

const Mint = props => {
  const { account } = useWeb3React()
  const { whineMarketContract } = useContracts()
  const [winery, setWinery] = useState()
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    if (account && !loaded) {
      whineMarketContract.getRegisteredWineryName(account).then(name => {
        setWinery(name)
        setLoaded(true)
      })
    }
    return () => {
      if (loaded) {
        setWinery(null)
        setLoaded(false)
      }
    }
  }, [whineMarketContract, account, loaded])

  let content
  if (!loaded) {
    content = 'Looking for registered winery...'
  } else {
    let component
    if (winery) {
      component = <MintForm winery={winery} />
    } else {
      component = <WineryRegisterForm setWinery={setWinery} />
    }
    content = (
      <Card h='min-content' w={['70%', '50%', '40%', '30%']}>
        {component}
      </Card>
    )
  }

  return <Center h='100%'>{content}</Center>
}

export default Mint
