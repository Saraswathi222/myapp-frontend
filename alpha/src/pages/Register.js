import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './register.css';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [message, setMessage] = useState({ text: '', type: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Step 1: Register the user
      const res = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage({ text: `Registration failed: ${data.error || 'Unknown error'}`, type: 'error' });
        return;
      }

      // Step 2: Auto-login after successful registration
      const loginRes = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, password: formData.password }),
      });

      const loginData = await loginRes.json();

      if (!loginRes.ok) {
        setMessage({ text: `Login failed after registration: ${loginData.error || 'Unknown error'}`, type: 'error' });
        return;
      }

      // Step 3: Store login token or user data
     localStorage.setItem('userId', data.user._id);


      setMessage({ text: 'Registered and logged in! Redirecting...', type: 'success' });
      setTimeout(() => navigate('/products'), 1000);
    } catch (err) {
      setMessage({ text: 'Registration failed: Server error', type: 'error' });
    }
  };

  return (
    <div className="auth-container">
      <form onSubmit={handleSubmit} className="auth-form">
        <h2>Sign Up</h2>
        {message.text && <div className={`message ${message.type}`}>{message.text}</div>}
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Register;
