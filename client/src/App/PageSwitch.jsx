import React from "react";
import { 
  HStack,
  Box,
  Text,
  useTheme,
  Center,
} from "@chakra-ui/react";
import { Link, useResolvedPath, useMatch } from "react-router-dom";

const PageLink = (props) => {
  const { url } = props;

  const theme = useTheme();
  const resolved = useResolvedPath(url)
  resolved.pathname = resolved.pathname.replace(/(\/\*)?$/,'/*');
  const match = useMatch({path: resolved.pathname});

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
              borderColor: 'white',
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
    baseURL
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
          <PageLink key={value} url={`${baseURL || ""}/${value.toLowerCase()}`}>
            <Text fontSize='md' fontWeight='semibold'>
              {value}
            </Text>
          </PageLink>
        );
      })}
    </HStack>
  )
};

export default PageSwitch;
