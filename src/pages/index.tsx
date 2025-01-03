import { DynamicModal, DynamicInput, DynamicButton } from '@/components/dynamic';
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
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false); // Dark mode toggle
  const [isValidating, setIsValidating] = useState<boolean>(false); // Loading state for validation
  const router = useRouter();

  const dispatch = useDispatch();
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );

  // Redirect jika sudah login
  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/posts'); // Redirect ke list jika sudah login
    }
  }, [isAuthenticated, router]);

  // Check localStorage for saved token and user name
  useEffect(() => {
    const savedToken = localStorage.getItem('apiToken');
    const savedName = localStorage.getItem('userName');
    const savedTheme = localStorage.getItem('theme') === 'dark';

    if (savedToken) {
      setApiToken(savedToken);
    } else {
      setIsModalVisible(true); // Show dialog if token is not available
    }

    if (savedName) {
      setUserName(savedName);
    }

    setIsDarkMode(savedTheme); // Load dark mode preference
  }, []);

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
        dispatch(login());
        localStorage.setItem('apiToken', apiToken); // Save token to localStorage
        localStorage.setItem('userName', userName); // Save user name to localStorage
        setIsModalVisible(false); // Close dialog
        router.push('/posts'); // Navigate to list page
      } else {
        alert('Invalid API token! Please provide a valid token.');
      }
    } else {
      alert('Please provide a valid name and API token!');
    }
  };

  // Handle dark mode toggle
  const toggleDarkMode = () => {
    setIsDarkMode((prev) => {
      const newMode = !prev;
      localStorage.setItem('theme', newMode ? 'dark' : 'light'); // Save preference to localStorage
      return newMode;
    });
  };

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
