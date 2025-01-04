import React, { useState } from 'react';
import { useTheme } from '@/components/themeProvider';
import {  DynamicButton, DynamicSwitch } from './dynamic';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import { logout } from '@/store/slices/authSlice'; 
import { LogoutOutlined } from '@ant-design/icons';
import { Modal } from 'antd';
interface HeaderProps {
  userName: string | null; // Nama user dari props
}

const Header: React.FC<HeaderProps> = ({ userName }) => {
  const { isDarkMode, toggleTheme } = useTheme();
  const dispatch = useDispatch();
  const router = useRouter();
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleLogout = () => {
    // Hapus token dan nama user dari localStorage
    localStorage.removeItem('apiToken');
    localStorage.removeItem('userName');
    // Dispatch action logout untuk mengubah state di Redux
    dispatch(logout());
    // Redirect ke halaman login
    router.push('/');
  };
  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false); 
  };
  return (
    <header
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <div style={{ fontSize: '20px', fontWeight: 'bold' }}>Synapsis</div>
      <div className="flex gap-4">
        <div style={{ fontSize: '16px' }}>{"Welcome, " + userName || 'Guest'}</div>
        <DynamicSwitch value={isDarkMode} onClick={toggleTheme}/>
        <LogoutOutlined
          style={{
            fontSize: '20px',
            cursor: 'pointer',
            color: isDarkMode ? '#fff' : '#000',
          }}
          onClick={showModal}
          title="Logout"
        />
      </div>
      <Modal
        title="Confirm Logout"
        open={isModalVisible}
        onOk={handleLogout}
        onCancel={handleCancel}
        okText="Logout"
        okButtonProps={{ danger: true }}
        cancelText="Cancel"
        closable={false}
      >
        <p>Are you sure you want to log out?</p>
      </Modal>
    </header>
  );
};

export default Header;
