import { useState, useEffect } from 'react';
import { ConfigProvider, theme } from 'antd';
import 'antd/dist/reset.css'; // Ant Design reset styles
import '@/styles/globals.css'; // Tailwind CSS atau global styles
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import axios from 'axios';
import { useRouter } from 'next/router';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from '../store';
import { ThemeProvider } from '@/components/themeProvider';
const queryClient = new QueryClient();

export default function App({ Component, pageProps }: any) {
  const [apiToken, setApiToken] = useState<string | null>(null); // API token state
  const [userName, setUserName] = useState<string>(''); // User name state
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false); // Modal visibility
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false); // Dark mode toggle
  const [isValidating, setIsValidating] = useState<boolean>(false); // Loading state for validation
  const router = useRouter();


  // Validate token with GoRest API
  const validateToken = async (token: string) => {
    setIsValidating(true);
    try {
      const response = await axios.get('https://gorest.co.in/public/v2/posts', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("response", response);
      setIsValidating(false);
      return response.status === 200; // Token valid if API call is successful
    } catch (error) {
      setIsValidating(false);
      return false; // Token invalid
    }
  };

  // Save token and user name
  const handleSave = async () => {
    if (apiToken && userName) {
      const isTokenValid = await validateToken(apiToken);

      if (isTokenValid) {
        localStorage.setItem('apiToken', apiToken); // Save token to localStorage
        localStorage.setItem('userName', userName); // Save user name to localStorage
        setIsModalVisible(false); // Close dialog
        router.push('/post'); // Navigate to list page
      } else {
        alert('Invalid API token! Please provide a valid token.');
      }
    } else {
      alert('Please provide a valid name and API token!');
    }
  };

  // Handle dark mode toggle

  const antTheme = {
    algorithm: isDarkMode ? theme.darkAlgorithm : theme.defaultAlgorithm, // Dark or light theme
    token: {
      colorPrimary: '#1890ff', // Customize primary color
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
