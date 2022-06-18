import React, { useEffect, Fragment } from "react";
import { InjectedConnector } from "@web3-react/injected-connector";
import { useWeb3React } from '@web3-react/core'
import { 
  HStack,
  Box,
  Flex,
  Spacer,
  Button,
  Text,
  useRadio,
  useRadioGroup,
  useTheme,
  Center,
} from "@chakra-ui/react";
import { HamburgerIcon } from "@chakra-ui/icons";
import { Link, useResolvedPath, useMatch } from "react-router-dom";

const MetamaskWallet = new InjectedConnector({
  supportedChainIds: [31337],
});

// function CustomLink({ children, to, ...props }) {
//   return (
//     <div>
//       <Link
//         style={{ textDecoration: match ? "underline" : "none" }}
//         to={to}
//         {...props}
//       >
//         {children}
//       </Link>
//       {match && " (active)"}
//     </div>
//   );
// }
const PageLink = (props) => {
  const { url } = props;
  const { getInputProps, getCheckboxProps } = useRadio(props);

  const resolved = useResolvedPath(url);
  const match = useMatch({ path: resolved.pathname, end: true });


  const input = getInputProps();
  console.log('input', input);
  const checkbox = getCheckboxProps();
  const theme = useTheme();

  return (
    <Box as='label'>
      <input {...input} />
      <Center
        {...checkbox}
        minWidth={24}
        color='foreground'
        _checked={{
          bg:'foreground',
          color:'white',
          borderWidth: theme.sizes['1'],
          borderRadius: theme.sizes['3'],
          borderColor: 'background',
        }}
        cursor='pointer'
        h={9}
      >
        {props.children}
      </Center>
    </Box>
  );
};

const PageSwitch = (props) => {
  const {
    pages,
    onChange,
  } = props;


  const { getRootProps, getRadioProps } = useRadioGroup({
    name: 'framework',
    defaultValue: pages[0],
    onChange: onChange,
  });

  const group = getRootProps();

  return (
    <HStack
      borderWidth={1}
      borderColor='foreground'
      borderRadius='lg'
      h={10}
      m={2}
      spacing={0}
      {...group}
    >
      {pages.map((value, index) => {
        const radio = getRadioProps({ value })

        return (
          <Link key={value} to={`/${value.toLowerCase()}`}>
          <PageLink key={value} url={`/${value.toLowerCase()}`} {...radio}>
            <Text fontSize='md' fontWeight='semibold'>
              {value}
            </Text>
          </PageLink>
          </Link>
        );
      })}
    </HStack>
  )
};

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

const Header = (props) => {
  const { account, activate } = useWeb3React();
  const { pages, onPageChange } = props;

  return (
    <Flex pl={10} h="10%">
      <PageSwitch gap={2} h={10} pages={pages} onChange={onPageChange} />
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
