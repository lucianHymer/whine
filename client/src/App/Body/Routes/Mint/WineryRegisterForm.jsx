import React, { useState } from "react";
import { 
  Button,
  Input,
  FormLabel,
  FormControl,
  Heading,
  FormHelperText,
} from '@chakra-ui/react';
import { useMessages } from "Messages";

const WineryRegisterForm = (props) => {
  const { whineContract, setWinery } = props;
  const [ wineryInput, setWineryInput ] = useState('');
  const messages = useMessages();

  const handleSubmit = (event) => {
    event.preventDefault();
    registerWinery();
  };

  const registerWinery = () => {
    whineContract['registerWinery(string)'](wineryInput).then( r => 
      setWinery(wineryInput)
    ).catch( e => {
      const message = e?.error?.data?.data?.message || e?.error?.message;
      messages.error({description: message});
    });
  };

  return (
    <form w='100%' align='center' onSubmit={handleSubmit}>
      <FormControl isRequired>
        <FormLabel requiredIndicator='' htmlFor='winery'>
          <Heading size='sm'>
            Winery Registration
          </Heading>
        </FormLabel>
        <Input
          id='winery'
          size='sm'
          onChange={(event) => setWineryInput(event.target.value)}
          value={wineryInput}
        />
        <FormHelperText>
          Add the name and click Register
        </FormHelperText>
      </FormControl>
      <Button type='submit' mt={6} size='md'>
        Register
      </Button>
    </form>
  );
};

export default WineryRegisterForm;
