import React, { useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom'; // ✅ import navigate
import 'react-toastify/dist/ReactToastify.css';

const Login = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate(); // ✅ initialize useNavigate

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error('Please fill in both email and password');
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password,
      });

      const userData = response.data.user;

      // ✅ Save user info in localStorage
      localStorage.setItem('user', JSON.stringify(userData));
      toast.success('Login successful');

      // ✅ Optional: Call parent callback
      if (onLoginSuccess) onLoginSuccess(userData);

      // ✅ Redirect to products page
      setTimeout(() => {
        navigate('/products'); // ⬅ redirect after login
      }, 1500);

      // Reset form
      setEmail('');
      setPassword('');
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        toast.error(error.response.data.error);
      } else {
        toast.error('Login failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container" style={{ maxWidth: 400, margin: 'auto', padding: 20 }}>
      <ToastContainer />
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <label>Email:</label>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />

        <label>Password:</label>
        <input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
};

export default Login;
