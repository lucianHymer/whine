import React from "react";
import { InjectedConnector } from "@web3-react/injected-connector";
import { useWeb3React } from '@web3-react/core'
import { 
  HStack,
  Box,
  Flex,
  Spacer,
  Button,
  Text,
  useTheme,
  Center,
} from "@chakra-ui/react";
import { HamburgerIcon } from "@chakra-ui/icons";
import { Link, useResolvedPath, useMatch } from "react-router-dom";

const MetamaskWallet = new InjectedConnector({
  supportedChainIds: [31337],
});

const PageLink = (props) => {
  const { url } = props;

  const theme = useTheme();
  const resolved = useResolvedPath(url);
  const match = useMatch({path: resolved.pathname, end: true});

  return (
    <Link to={url}>
      <Box as='label'>
        <Center
          minWidth={24}
          color='foreground'
          cursor='pointer'
          h={9}
          { ...( match ?
            {
              bg:'foreground',
              color:'secondary.main',
              borderWidth: theme.sizes['1'],
              borderRadius: theme.sizes['3'],
              borderColor: 'background',
            } : {})
          }
        >
          {props.children}
        </Center>
      </Box>
    </Link>
  );
};

const PageSwitch = (props) => {
  const {
    pages,
    h,
  } = props;


  return (
    <HStack
      borderWidth={1}
      borderColor='foreground'
      borderRadius='lg'
      h={h}
      m={2}
      spacing={0}
    >
      {pages.map((value, index) => {
        return (
          <PageLink key={value} url={`/${value.toLowerCase()}`}>
            <Text fontSize='md' fontWeight='semibold'>
              {value}
            </Text>
          </PageLink>
        );
      })}
    </HStack>
  )
};

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
  const { account, activate } = useWeb3React();
  const { pages } = props;

  return (
    <Flex h='100%' pl={10}>
      <PageSwitch gap={2} h={10} pages={pages} />
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
