import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';


import Home from './pages/Home';
import Products from './pages/Products';
import Cart from './pages/Cart';
import Wishlist from './pages/Wishlist';
import Checkout from './pages/Checkout';
import Login from './pages/Login';
import Register from './pages/Register';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AddProduct from './pages/AddProduct';
import Orders from './pages/Orders';
import ProductDetail from './pages/ProductDetail';

import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <Router>
      <Navbar />
      <Routes>
  <Route path="/" element={<Home />} />
  <Route path="/products" element={<Products />} />
  <Route path="/products/:id" element={<ProductDetail />} />
  <Route path="/cart" element={<Cart />} />
  <Route path="/wishlist" element={<Wishlist />} />
  <Route path="/checkout" element={<Checkout />} />
  <Route path="/login" element={<Login />} />
  <Route path="/register" element={<Register />} />
  <Route path="/add-product" element={<AddProduct />} 
  /> {/* New route */}
  <Route path="/orders" element={<Orders />} />
   

</Routes>

      <Footer />
    </Router>
  </React.StrictMode>
);
