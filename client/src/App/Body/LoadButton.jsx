import React, { useReducer } from 'react'

import { VStack, Button, Spinner, Text } from '@chakra-ui/react'

const makeInitialState = initialProps => {
  return {
    initialProps,
    props: initialProps
  }
}

const stageReducer = (state, dispatch) => {
  const { reset, ...rest } = dispatch

  const { initialProps } = state

  if (reset) return makeInitialState(initialProps)

  return {
    initialProps,
    props: rest
  }
}

export const useLoadButtonReducer = initialProps => {
  const [state, dispatch] = useReducer(
    stageReducer,
    makeInitialState(initialProps)
  )

  return [state.props, dispatch]
}

const LoadButton = props => {
  const {
    showSpinner,
    showButton,
    hideMessage,
    message,
    buttonText,
    callback,
    innerRef,
    children,
    buttonOverrideProps,
    ...rest
  } = props

  const buttonProps = Object.assign(
    callback
      ? {
          onClick: callback
        }
      : {
          type: 'submit'
        },
    buttonOverrideProps
  )

  return (
    <VStack ref={innerRef} {...rest}>
      {showSpinner && (
        <Spinner
          size='lg'
          mb={4}
          color='primary.main'
          emptyColor='primary.100'
        />
      )}
      {!hideMessage && message && <Text mb={4}>{message}</Text>}
      {showButton && <Button {...buttonProps}>{buttonText || children}</Button>}
    </VStack>
  )
}

export default LoadButton
