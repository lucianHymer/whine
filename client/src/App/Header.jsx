import React from "react";
import { InjectedConnector } from "@web3-react/injected-connector";
import { useWeb3React } from '@web3-react/core'
import { 
  Flex,
  Spacer,
  Button,
  Text,
} from "@chakra-ui/react";
import { HamburgerIcon } from "@chakra-ui/icons";
import PageSwitch from "./PageSwitch";

const MetamaskWallet = new InjectedConnector({
  supportedChainIds: [31337, 5],
});

const WalletButtonText = () => {
  const { account } = useWeb3React();

  if(account)
    return (
      <>
        <Spacer />
        <Text color='secondary.main'>{"\u2B24"}</Text>
        <Spacer />
        Connected
        <Spacer />
      </>
    );
  else
    return (
      <>
        <Spacer />
        Connect Wallet
        <Spacer />
      </>
    );
};

const Header = (props) => {
  const { activate, account } = useWeb3React();
  const { activate: activateData } = useWeb3React('data');
  const { pages } = props;

  const handleClick = () => {
    activate(MetamaskWallet); 
    activateData(MetamaskWallet);
  };

  return (
    <Flex h='100%' pl={10}>
      <PageSwitch gap={2} h={10} pages={pages} />
      <Spacer />
      <Button m={2} variant={account ? 'solid' : 'outline'} size='md' onClick={handleClick}>
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
