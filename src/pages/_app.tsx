import { AppProps } from 'next/app'; 
import { useState } from 'react';
import { ConfigProvider, theme } from 'antd';
import 'antd/dist/reset.css'; 
import '@/styles/globals.css'; 
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from '../store';
import { ThemeProvider } from '@/components/themeProvider';
const queryClient = new QueryClient();

export default function App({ Component, pageProps }: AppProps) {
  const [isDarkMode] = useState<boolean>(false); 

  const antTheme = {
    algorithm: isDarkMode ? theme.darkAlgorithm : theme.defaultAlgorithm, 
    token: {
      colorPrimary: '#1890ff', 
    },
  };

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider>
            <ConfigProvider theme={antTheme}>
              <div >
                <Component {...pageProps} />
              </div>
            </ConfigProvider>
          </ThemeProvider>
          <ReactQueryDevtools initialIsOpen={false} /> {/* React Query DevTools */}
        </QueryClientProvider>
      </PersistGate>
    </Provider>
  );
}
