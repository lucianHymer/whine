import React, { Fragment } from "react";
import { InjectedConnector } from "@web3-react/injected-connector";
import { useWeb3React } from '@web3-react/core'
import { 
  Flex,
  Spacer,
  Button,
  Text,
} from '@chakra-ui/react';
import { HamburgerIcon } from '@chakra-ui/icons';

const MetamaskWallet = new InjectedConnector({
  supportedChainIds: [31337],
});

const WalletButtonText = () => {
  const { account } = useWeb3React();

  if(account)
    return (
      <Fragment>
        <Spacer />
        <Text color='green.300'>{"\u2B24"}</Text>
        <Spacer />
        Connected
        <Spacer />
      </Fragment>
    );
  else
    return (
      <Fragment>
        <Spacer />
        Connect Wallet
        <Spacer />
      </Fragment>
    );
};

const Header = () => {
  const { account, activate } = useWeb3React();

  return (
    <Flex h="10%">
      <Spacer />
      <Button m={2} size='md' onClick={() => account ? "" : activate(MetamaskWallet) }>
        <Flex w="8em">
          <WalletButtonText />
        </Flex>
      </Button>
      <Button m={2} size='md' onClick={() => alert("Under Development") }>
        <HamburgerIcon />
      </Button>
    </Flex>
  );
};

export default Header;
