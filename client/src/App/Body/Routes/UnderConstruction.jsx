import React, { useState, useEffect } from "react";
import { faker } from "@faker-js/faker";
import {
  Heading,
  Text,
  VStack,
  Center,
} from "@chakra-ui/react"

const UnderConstruction = () => {
  const [phrase, setPhrase] = useState();

  const getPhrase = () => faker.company.catchPhrase();

  useEffect(() => {
    const interval = setInterval( () => {
      setPhrase(getPhrase());
    }, 7000);
    return () => clearInterval(interval);
  });

  useEffect(() => {
    setPhrase(getPhrase());
  }, []);

  return (
    <Center h='100%'>
      <VStack>
        <Heading>
          Under Construction
        </Heading>
        <Text>
          {phrase}
        </Text>
      </VStack>
    </Center>
  );
};

export default UnderConstruction;
