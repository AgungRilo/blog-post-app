import React from 'react';
import { useTheme } from '@/components/themeProvider';
import {  DynamicSwitch } from './dynamic';
interface HeaderProps {
  userName: string | null; // Nama user dari props
}

const Header: React.FC<HeaderProps> = ({ userName }) => {
  const { isDarkMode, toggleTheme } = useTheme();
  return (
    <header
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '10px 20px',
        // backgroundColor: '#f0f2f5',
      }}
    >
      {/* Kiri: Synapsis */}
      <div style={{ fontSize: '20px', fontWeight: 'bold' }}>Synapsis</div>
      {/* Kanan: Nama User */}
      <div className="flex gap-4">
        <div style={{ fontSize: '16px' }}>{"Welcome, " + userName || 'Guest'}</div>
        <DynamicSwitch onClick={toggleTheme}/>
      </div>
    </header>
  );
};

export default Header;
