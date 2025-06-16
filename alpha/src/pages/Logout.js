import React from 'react';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('user'); // Clear user data
    navigate('/login');               // Redirect to login page
  };

  return (
    <button onClick={handleLogout} style={{
      backgroundColor: '#ff4d4f',
      color: 'white',
      border: 'none',
      padding: '8px 16px',
      borderRadius: '4px',
      cursor: 'pointer',
    }}>
      Logout
    </button>
  );
};

export default Logout;
