import React, { ReactNode } from 'react';
import { Card as AntCard } from 'antd';
import { useTheme } from '@/components/themeProvider';

interface CardProps {
  children: ReactNode;
}

const Card: React.FC<CardProps> = ({ children }) => {
  const { isDarkMode } = useTheme();

  const cardStyle = {
    width: 900,
    backgroundColor: isDarkMode ? '#1f1f1f' : '#ffffff', // Warna latar berdasarkan tema
    color: isDarkMode ? '#ffffff' : '#000000', // Warna teks berdasarkan tema
    border: `1px solid ${isDarkMode ? '#434343' : '#d9d9d9'}`, // Warna border
  };

  return <AntCard className='mt-4' style={cardStyle}>{children}</AntCard>;
};

export default Card;
