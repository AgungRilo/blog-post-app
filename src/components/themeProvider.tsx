import React, { useState, createContext, useContext, ReactNode } from 'react';
import { ConfigProvider, Button } from 'antd';

// Context untuk mengelola tema
const ThemeContext = createContext({
  isDarkMode: false,
  toggleTheme: () => {},
});

// Provider untuk tema
interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      <ConfigProvider
        theme={{
          components: {
            // Pagination: {
            //     itemBg: isDarkMode ? '#1f1f1f' : '#f0f2f5', // Latar belakang default
            //     controlItemBgActive: isDarkMode ? '#3a3a3a' : '#1890ff', // Latar belakang item aktif
            //     controlItemBgActiveHover: isDarkMode ? '#3a3a3a' : '#40a9ff', // Latar belakang item aktif saat hover
            //     controlItemBgHover: isDarkMode ? '#2a2a2a' : '#e6f7ff', // Latar belakang item saat hover
            //   },
            Input: {
                colorTextPlaceholder: isDarkMode ? '#888888' : '#bfbfbf', 
                colorBgContainer: isDarkMode ? '#1f1f1f' : '#fff',
                colorText: isDarkMode ? '#fff' : '#000',
                colorBorder: isDarkMode ? '#434343' : '#d9d9d9',
              },

              Switch: {
                colorPrimary: isDarkMode ? '#40a9ff' : '#1890ff', // Warna tombol aktif
                colorBgContainer: isDarkMode ? '#1f1f1f' : '#ffffff', // Warna latar belakang
                controlOutline: isDarkMode ? '#434343' : '#d9d9d9', // Outline
              },
              
            },
           
            
            token: {
              colorText: isDarkMode ? '#ffffff' : '#000000', // Warna teks global
              colorPrimary: isDarkMode ? '#1890ff' : '#1890ff', // Warna utama
            },
        }}
      >
        <div
          style={{
            backgroundColor: isDarkMode ? '#000' : '#fff',
            color: isDarkMode ? '#fff' : '#000',
            minHeight: '100vh',
            padding: '40px',
          }}
        >
          {children}
        </div>
      </ConfigProvider>
    </ThemeContext.Provider>
  );
};

// Hook untuk menggunakan tema
export const useTheme = () => {
  return useContext(ThemeContext);
};
