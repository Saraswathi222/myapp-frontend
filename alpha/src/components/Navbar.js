import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) {
      setUser(JSON.parse(stored));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login'); // Go to login after logout
  };

  return (
    <nav className="navbar">
      <h2 className="logo" onClick={() => navigate('/')}>MyShop</h2>
      <ul className="nav-links">
  <li><Link to="/">Home</Link></li>
  <li><Link to="/products">Products</Link></li>
  <li><Link to="/cart">Cart</Link></li>
  <li><Link to="/wishlist">Wishlist</Link></li>
  <li><Link to="/add-product">Add Product</Link></li>
      <li><Link to="/orders">Orders</Link></li>
      <li><Link to="/dashboard">Dashboard</Link></li>

  

  {!user ? (
    <>
      <li><Link to="/login">Login</Link></li>
      <li><Link to="/register">Register</Link></li>
    </>
  ) : (
    <li>
      <button onClick={handleLogout} className="logout-button">
        Logout
      </button>
    </li>
  )}
</ul>

    </nav>
  );
};

export default Navbar;
