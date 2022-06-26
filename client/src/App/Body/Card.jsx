import React, {} from "react";
import { 
  Box,
} from '@chakra-ui/react';

const Card = (props) => {
  const {
    selected,
    children,
    ...rest
  } = props;

  const style = selected ? {
    borderWidth: '5px',
    borderColor: 'secondary.main',
    boxShadow: 'xl',
    bg: 'background',
  } : {
    m: '3px',
    borderColor: 'foreground',
    boxShadow: 'lg',
    bg: 'midground',
  };

  return (
    <Box
      p={5}
      rounded='xl'
      border='2px'
      {...style}
      {...rest}
    >
      {children}
    </Box>
  );
};

export default Card;
