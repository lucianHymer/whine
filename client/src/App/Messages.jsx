import React, { useContext, createContext } from "react";
import { useToast } from "@chakra-ui/react";

const genError = (toast) => (message) => {
  toast({
    title: "Error",
    description: message,
    status: "error",
    duration: 5000,
    isClosable: true,
  });
};

const genInfo = (toast) => (message) => {
  toast({
    title: message,
    status: "info",
    duration: 5000,
    isClosable: true,
  });
};

const Messages = createContext({});

const MessagesProvider = (props) => {
  const toast = useToast();
  const value = {
    error: genError(toast),
    info: genInfo(toast),
  };
  return (
    <Messages.Provider value={value}>
      {props.children}
    </Messages.Provider>
  );
};

const useMessages = () => useContext(Messages);

export { MessagesProvider, Messages, useMessages };
