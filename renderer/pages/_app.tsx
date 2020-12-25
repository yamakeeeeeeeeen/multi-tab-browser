import { AppProps } from 'next/app';
import { ChakraProvider, CSSReset } from '@chakra-ui/react';

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <ChakraProvider>
      <CSSReset />
      <Component {...pageProps} />
    </ChakraProvider>
  );
};

export default App;
