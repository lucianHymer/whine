import React from "react";

import { 
  Box,
  Button,
  Spinner,
  Text,
} from '@chakra-ui/react';

const defaultPendingMessage = "Please approve transaction in your wallet, then wait for it to be processed";

const LoadButton = (props) => {
  const {
    pending,
    pendingMessage,
    buttonText,
    ...rest
  } = props;

  let component;
  if(pending)
     component = (
       <Box {...rest}>
         <Text>{pendingMessage || defaultPendingMessage}</Text>
         <Spinner size='lg' mt={4} color='primary.main' emptyColor='primary.100' />
       </Box>
     );
  else
    component = (
      <Button type='submit' size='md' {...rest}>
        {buttonText}
      </Button>
    );
  return component;
};

export default LoadButton;
