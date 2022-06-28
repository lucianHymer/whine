import React, { useEffect, useState } from "react";
import { 
  VStack,
  HStack,
  Text,
  Box,
  Image,
} from '@chakra-ui/react';

import Card from "../../Card";

const LINE_SPACING = 1;

const Label = (props) => {
  return (
  <Text fontWeight='bold' p={LINE_SPACING} {...props}>
    {props.children}
  </Text>
  );
};

const Value = (props) => {
  return (
  <Text whiteSpace="nowrap" p={LINE_SPACING} {...props}>
    {props.children}
  </Text>
  );
};

const Whine = (props) => {
  const {
    index,
    winery,
    varietal,
    vintage,
    royalties,
    showRoyalties,
    image,
    selectedCallback,
  } = props;

  const [selected, setSelected] = useState(false);

  useEffect( () => {
    if(selectedCallback)
      selectedCallback(selected, index);
  }, [selected, selectedCallback, index]);

  const handleClick = (event) => {
    event.preventDefault();
    setSelected(!selected)
  };

  const imageSrc = image && `https://gateway.pinata.cloud/ipfs/${image.replace(/^\s*ipfs:\/\//,'')}`;

  return (
    <Card p={[1, 2, 3]} selected={selected} onClick={handleClick}>
      <VStack>
        <Image
          boxSize={[28, 36, 48]}
          fit='contain'
          src={imageSrc}
        />
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
            {
              showRoyalties &&
                <Value>{(royalties / 100).toFixed(2)}%</Value>
            }
          </Box>
        </HStack>
      </VStack>
    </Card>
  );
};

export default Whine;
