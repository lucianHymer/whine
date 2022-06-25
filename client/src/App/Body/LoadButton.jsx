import React, { useEffect, useReducer } from "react";

import { 
  VStack,
  Box,
  Button,
  Spinner,
  Text,
} from '@chakra-ui/react';

const stageReducer = (state, action) => {
  let stageCount = state.stageCount;
  switch (action) {
    case 'next':
      stageCount++;
    case 'previous':
      stageCount--;
    case 'reset':
      stageCount = 0;
    default:
      throw new Error(`Invalid dispatch ${dispatch}`);
  };

  return {
    stageCount, stages,
    stage: stages[stageCount],
  };
};

const useMultiStageLoadButton = (stages) => {
  const [state, dispatch] = useReducer(stageReducer, {stages});
  useEffect( () => dispatch('reset'), [] );

  return {
    currentProps: state.stage,
    dispatch,
  };
};

const LoadButton = (props) => {
  const {
    showSpinner,
    showButton,
    message,
    buttonText,
    callback,
    ...rest
  } = props;

  const buttonProps = callback ?  {
    onClick: callback
  } : {
    type: 'submit'
  };

  return (
    <VStack {...rest}>
      {showSpinner && <Spinner
        size='lg'
        mb={4}
        color='primary.main'
        emptyColor='primary.100'
      />}
      {message && <Text mb={4}>{message}</Text>}
      {showButton &&
        <Button {...buttonProps} size='md'>
          {buttonText}
        </Button>
      }
    </VStack>
  );
};

export default LoadButton;
