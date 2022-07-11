import React, { useRef, useEffect } from 'react'
import { VStack, HStack, Text, Box, Image } from '@chakra-ui/react'
import { CheckCircleIcon } from '@chakra-ui/icons'

import LoadButton from 'App/Body/LoadButton'

import Card from '../../Card'

const LINE_SPACING = 1

const Label = props => {
  return (
    <Text fontWeight='bold' p={LINE_SPACING} {...props}>
      {props.children}
    </Text>
  )
}

const Value = props => {
  return (
    <Text whiteSpace='nowrap' p={LINE_SPACING} {...props}>
      {props.children}
    </Text>
  )
}

const Overlay = ({ children, ...props }) => {
  return (
    <Box bg='blackAlpha.600' {...props}>
      {children}
    </Box>
  )
}

const useOutsideClickDetection = (ref, callback) => {
  useEffect(() => {
    const handleClickOutside = event => {
      if (ref.current && !ref.current.contains(event.target)) callback()
    }

    // Bind the event listener
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [ref, callback])
}

const Whine = props => {
  const {
    winery,
    varietal,
    vintage,
    royalties,
    showRoyalties,
    image,
    listed,
    selected,
    setSelected,
    onUnlist,
    pendingUnlist
  } = props

  const ref = useRef()

  const deselectOnClickAway = () => {
    if (listed && selected) setSelected(false)
  }

  useOutsideClickDetection(ref, deselectOnClickAway)

  const handleClick = event => {
    event.preventDefault()
    setSelected(!selected)
  }

  const imageSrc =
    image &&
    `https://gateway.pinata.cloud/ipfs/${image.replace(/^\s*ipfs:\/\//, '')}`

  const card = (
    <Card
      p={[1, 2, 3]}
      selected={selected && !listed}
      onClick={handleClick}
      {...(listed ? { borderColor: 'primary.100' } : {})}
    >
      <VStack>
        <Box position='relative'>
          {listed && (
            <Text
              transform='rotate(-35deg)'
              align='center'
              w={[14, 16, 20]}
              left='-4'
              top='4'
              position='absolute'
              color='yellow.100'
              bg='red.400'
              borderRadius='sm'
              fontSize={['md', null, 'xl']}
            >
              Listed
            </Text>
          )}
          <Image boxSize={[28, 36, 48]} fit='contain' src={imageSrc} />
        </Box>
        <HStack fontSize={['xs', 'sm', 'md']}>
          <Box align='center'>
            <Label>Winery</Label>
            <Label>Vintage</Label>
            <Label>Varietal</Label>
            {showRoyalties && <Label>Royalties</Label>}
          </Box>
          <Box align='center'>
            <Value>{winery}</Value>
            <Value>{vintage}</Value>
            <Value>{varietal}</Value>
            {showRoyalties && <Value>{(royalties / 100).toFixed(2)}%</Value>}
          </Box>
        </HStack>
      </VStack>
    </Card>
  )

  if (listed && selected)
    return (
      <Box position='relative'>
        <LoadButton
          innerRef={ref}
          callback={onUnlist}
          showButton={!pendingUnlist}
          showSpinner={pendingUnlist}
          position='absolute'
          top='50%'
          left='50%'
          transform='translate(-50%, -50%)'
          zIndex={3}
          h='32'
          w='32'
          align='center'
          buttonOverrideProps={{
            h: '100%',
            p: 5
          }}
        >
          <VStack>
            <Text fontSize='2xl'>Unlist?</Text>
            <CheckCircleIcon boxSize='14' />
          </VStack>
        </LoadButton>
        <Overlay borderRadius='xl'>{card}</Overlay>
      </Box>
    )

  return card
}

export default Whine
