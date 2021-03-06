import React, { useState } from 'react'
import axios from 'axios'
import { useWeb3React } from '@web3-react/core'
import { Input, FormLabel, FormControl } from '@chakra-ui/react'

import constants from 'whineConstants'
import RoyaltiesField from './MintForm/RoyaltiesField'
import VintageField from './MintForm/VintageField'
import { useMessages } from 'Messages'
import LoadButton, { useLoadButtonReducer } from 'App/Body/LoadButton'
import { useContracts } from 'App/Contract'

const MintForm = props => {
  const { winery } = props
  const { whineMarketContract } = useContracts()
  const { account } = useWeb3React()
  const [varietal, setVarietal] = useState('')
  const [vintage, setVintage] = useState(new Date().getUTCFullYear())
  const [royalties, setRoyalties] = useState('3.00')
  const [loadButtonProps, setLoadButtonState] = useLoadButtonReducer({
    showButton: true,
    showSpinner: false,
    buttonText: 'Mint'
  })
  const Messages = useMessages()

  const handleSubmit = event => {
    event.preventDefault()
    setLoadButtonState({
      showButton: false,
      showSpinner: true,
      message:
        'Approve the signature in your wallet to authenticate your request (Step 1 of 2)'
    })
    console.log('Submitted')
    mintNft()
  }

  const mintNft = () => {
    const metadata = {
      name: 'Whine',
      description: 'A Whine token redeemable for 1 wine bottle',
      image:
        'ipfs://QmXVq2TDQVc4g6FzZCGXUmEu7MDkcAAGmGy83Eijnwt2mH/wineBottle.png',
      properties: { vintage: `${vintage}`, varietal, winery }
    }

    axios
      .post(`${constants.BACKEND_URL}/create_nft_metadata`, {
        metadata
      })
      .then(async res => {
        setLoadButtonState({
          showSpinner: true,
          showButton: false,
          message:
            'Approve the transaction in your wallet, then wait for it to go through (Step 2 of 2)'
        })
        const tx = await whineMarketContract.mintNft(
          account,
          res.data.ipfsHash,
          parseInt(parseFloat(royalties) * 100)
        )
        const txReceipt = await tx.wait()
        console.log('txReceipt', txReceipt)
        setLoadButtonState({ reset: true })
        Messages.success({
          title: 'Successfully minted some WHINE!',
          description: 'Go check it out on the Trade page.',
          duration: 6000
        })
      })
      .catch(e => {
        Messages.error({
          title: 'Error creating NFT',
          description: e?.error?.data?.message || e?.message
        })
        console.log('Error creating NFT', e)
        setLoadButtonState({ reset: true })
      })
  }

  return (
    <form align='center' onSubmit={handleSubmit}>
      <FormControl isRequired isReadOnly>
        <FormLabel requiredIndicator='' htmlFor='winery'>
          Winery
        </FormLabel>
        <Input id='winery' variant='filled' size='sm' value={winery} />
      </FormControl>
      <FormControl isRequired mt={4}>
        <FormLabel requiredIndicator='' htmlFor='varietal'>
          Varietal
        </FormLabel>
        <Input
          id='varietal'
          size='sm'
          placeholder='Pinot Noir'
          value={varietal}
          onChange={event => setVarietal(event.target.value)}
        />
      </FormControl>
      <VintageField vintage={vintage} setVintage={setVintage} />
      <RoyaltiesField royalties={royalties} setRoyalties={setRoyalties} />
      <LoadButton mt={6} {...loadButtonProps} />
    </form>
  )
}

export default MintForm
