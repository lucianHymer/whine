import React, { useEffect } from 'react'
import { useWeb3React } from '@web3-react/core'
import axiosAuthenticatorMiddleware from './axios_authenticator'
import { Box } from '@chakra-ui/react'
import Body from './App/Body'
import Header from './App/Header'
import { useMessages } from 'Messages'
import { ContractProvider } from './App/Contract.jsx'

const PAGES = ['Mint', 'Trade', 'Redeem']

const App = () => {
  const { account, library } = useWeb3React()
  const messages = useMessages()

  useEffect(() => {
    // TODO see what happens with this when switching accounts
    if (account) {
      const middleware = axiosAuthenticatorMiddleware.add(
        account,
        library,
        errorMessage => {
          messages.error({
            title: 'Auth Error',
            description: errorMessage
          })
        }
      )

      return () => {
        axiosAuthenticatorMiddleware.remove(middleware)
      }
    }
  }, [account, library, messages])

  return (
    <Box bg='background' h='100vh'>
      <Box h={['15vh', '7vh']}>
        <Header pages={PAGES} />
      </Box>
      <Box h={['85vh', '93vh']}>
        <ContractProvider>
          <Body />
        </ContractProvider>
      </Box>
    </Box>
  )
}

export default App
