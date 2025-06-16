import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './home.css';

const Home = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) {
      setUser(JSON.parse(stored));
    }
  }, []);

  return (
    <div className="home-page">
      <div className="welcome-section">
        <h1>Welcome to MeShow E-commerce</h1>
        <p>Your one-stop shop for everything you love!</p>
        <p>Discover amazing products at unbeatable prices.</p>

        {!user ? (
          <>
            <button 
              className="register-btn" 
              onClick={() => navigate('/register')}
            >
              Register Now
            </button>
            <p>
              Already have an account?{' '}
              <span 
                className="login-link" 
                onClick={() => navigate('/login')}
              >
                Login
              </span>
            </p>
          </>
        ) : (
          <div className="user-info">
            <h3>Hello, {user.name} 👋</h3>
            <p>Visit your <span onClick={() => navigate('/dashboard')} style={{ cursor: 'pointer', color: 'blue' }}>dashboard</span>.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
