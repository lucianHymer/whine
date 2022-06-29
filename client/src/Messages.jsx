import React, { useContext, createContext } from "react";
import { useToast } from "@chakra-ui/react";

const genToast = (toast, type, defaultTitle) => (props) =>
  toast({
    duration: 5000,
    isClosable: true,
    title: defaultTitle,
    status: type,
    ...props,
  });

const Messages = createContext({});

const MessagesProvider = (props) => {
  const toast = useToast();
  const value = {
    error: genToast(toast, 'error', 'Error'),
    info: genToast(toast, 'info', 'Info'),
    warning: genToast(toast, 'warning', 'Warning'),
    success: genToast(toast, 'success', 'Success'),
  };

  value.handleError = (error) => {
    console.log(error);
    const message = (
      error?.error?.data?.data?.message ||
      error?.error?.message ||
      error?.message
    );
    value.error({description: message});
  };

  return (
    <Messages.Provider value={value}>
      {props.children}
    </Messages.Provider>
  );
};

const useMessages = () => useContext(Messages);

export { MessagesProvider, Messages, useMessages };
