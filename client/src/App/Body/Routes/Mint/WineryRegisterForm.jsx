import React, { useState } from "react";
import { useWeb3React } from '@web3-react/core'
import { 
  Input,
  FormLabel,
  FormControl,
  Heading,
  FormHelperText,
} from '@chakra-ui/react';
import { useMessages } from "Messages";
import LoadButton from "App/Body/LoadButton";
import { useEventListener } from "App/Contract";

const WineryRegisterForm = (props) => {
  const { whineContract, setWinery } = props;
  const { account } = useWeb3React();
  const [ wineryInput, setWineryInput ] = useState('');
  const [ pending, setPending ] = useState(false);
  const messages = useMessages();
  const listen = useEventListener();

  const handleSubmit = (event) => {
    setPending(true);
    event.preventDefault();
    registerWinery();
  };

  const registerWinery = () => {
    whineContract['registerWinery(string)'](wineryInput).then( r=> {
      const filter = whineContract.filters.RegisterWinery(account);
      return listen(whineContract, filter)
    }).then( ([wallet, event]) => {
      setPending(false);
      setWinery(wineryInput);
    }).catch( e => {
      const message = (
        e?.error?.data?.data?.message ||
        e?.error?.message ||
        e?.message
      );
      messages.error({description: message});
      setPending(false);
    });
  };

  // TODO add Pending Approval stage
  return (
    <form w='100%' align='center' onSubmit={handleSubmit}>
      <FormControl isRequired>
        <FormLabel requiredIndicator='' htmlFor='winery'>
          <Heading size='sm'>
            Winery Registration
          </Heading>
        </FormLabel>
        { pending || (
          <>
            <Input
              id='winery'
              size='sm'
              onChange={(event) => setWineryInput(event.target.value)}
              value={wineryInput}
            />
            <FormHelperText>
              Add the name and click Register
            </FormHelperText>
          </>
        )}
      </FormControl>
      <LoadButton
        mt={4}
        showButton={!pending}
        hideMessage={!pending}
        showSpinner={pending}
        buttonText="Register"
        message="Approve the transaction in your wallet, then wait for it to go through"
      />
    </form>
  );
};

export default WineryRegisterForm;
