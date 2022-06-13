import { InjectedConnector } from "@web3-react/injected-connector";
import { useWeb3React } from '@web3-react/core'
import { 
  Flex,
  Spacer,
  Button,
} from '@chakra-ui/react';
import { HamburgerIcon } from '@chakra-ui/icons';

const MetamaskWallet = new InjectedConnector({
  supportedChainIds: [31337],
});

const Header = () => {
  const { activate } = useWeb3React();

  return (
    <Flex h="10%">
      <Spacer />
      <Button m={2} size='md' onClick={() => activate(MetamaskWallet) }>
        Connect Wallet
      </Button>
      <Button m={2} size='md' onClick={() => alert("Under Development") }>
        <HamburgerIcon />
      </Button>
    </Flex>
  );
};

export default Header;
