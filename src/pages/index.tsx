import { DynamicModal, DynamicInput, DynamicButton, DynamicSpin } from '@/components/dynamic';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../store/slices/authSlice';
import { RootState } from '../store';
import axios from 'axios';

export default function Home() {
  const [apiToken, setApiToken] = useState<string | null>(null); // API token state
  const [userName, setUserName] = useState<string>(''); // User name state
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false); // Modal visibility
  const [isValidating, setIsValidating] = useState<boolean>(false); // Loading state for validation
  const [isInitializing, setIsInitializing] = useState<boolean>(true); // State to indicate initialization
  const router = useRouter();

  const dispatch = useDispatch();
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );

  // Initialize the app state
  useEffect(() => {
    const savedToken = localStorage.getItem('apiToken');
    const savedName = localStorage.getItem('userName');
    const savedTheme = localStorage.getItem('theme') === 'dark';

    if (savedToken && savedName) {
      setApiToken(savedToken);
      setUserName(savedName);
      dispatch(login());
    } else {
      setIsModalVisible(true);
    }

    setIsInitializing(false); // Mark initialization complete
  }, [dispatch]);

  // Redirect jika sudah login
  useEffect(() => {
    if (!isInitializing && isAuthenticated) {
      router.replace('/posts'); // Redirect ke list jika sudah login
    }
  }, [isAuthenticated, isInitializing, router]);

  // Validate token with GoRest API
  const validateToken = async (token: string) => {
    setIsValidating(true);
    try {
      const response = await axios.get('https://gorest.co.in/public/v2/posts', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
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
        dispatch(login());
        localStorage.setItem('apiToken', apiToken); // Save token to localStorage
        localStorage.setItem('userName', userName); // Save user name to localStorage
        setIsModalVisible(false); // Close dialog
        router.replace('/posts'); // Navigate to list page
      } else {
        alert('Invalid API token! Please provide a valid token.');
      }
    } else {
      alert('Please provide a valid name and API token!');
    }
  };

  // Show loading spinner during initialization
  if (isInitializing) {
    return <DynamicSpin size="large" />;
  }

  return (
    <div className="p-4">
      <DynamicModal
        title="Welcome to Blog Post App"
        visible={isModalVisible}
        footer={null}
        closable={false}
      >
        <DynamicInput
          placeholder="Enter your name"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          className="mb-4"
        />
        <DynamicInput
          placeholder="Enter your GoRest API token"
          value={apiToken || ''}
          onChange={(e) => setApiToken(e.target.value)}
          className="mb-4"
        />
        <DynamicButton
          type="primary"
          onClick={handleSave}
          loading={isValidating} // Show loading indicator while validating
        >
          Save
        </DynamicButton>
      </DynamicModal>
    </div>
  );
}
