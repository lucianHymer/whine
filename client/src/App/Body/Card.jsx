import React, {} from "react";
import { 
  Box,
} from '@chakra-ui/react';

const Card = (props) => {
  return (
    <Box p={5} rounded='xl' border='2px' borderColor='foreground' boxShadow='lg' bg='midground' {...props}>
      {props.children}
    </Box>
  );
};

export default Card;
