import React from 'react'
import { VStack, Heading } from '@chakra-ui/react'
import { useParams } from 'react-router-dom'
import PageSwitch from 'App/PageSwitch'
import UnderConstruction from './UnderConstruction'

import Sell from './Trade/Sell'

const Buy = props => {
  return <UnderConstruction />
}

const Trade = props => {
  const { mode } = useParams()

  return (
    <VStack h='100%' w='100%'>
      <Heading mt={[0, null, null, -8]} pb={1} color='primary.main'>
        More WHINE?
      </Heading>
      <PageSwitch gap={2} h={10} pages={['Sell', 'Buy']} baseURL='/trade' />
      {mode === 'sell' ? <Sell /> : <Buy />}
    </VStack>
  )
}

export default Trade
