import React, { useEffect, useState } from 'react';
import axios from 'axios';
import'./App.css';

function App({ userId }) {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    if (!userId) return;

    axios.get('http://localhost:5000/api/products')
      .then(res => setProducts(res.data))
      .catch(console.error);

    axios.get(`http://localhost:5000/api/cart/${userId}`)
      .then(res => setCart(res.data))
      .catch(console.error);

    axios.get(`http://localhost:5000/api/wishlist/${userId}`)
      .then(res => setWishlist(res.data))
      .catch(console.error);
  }, [userId]);

  const addToCart = (productId) => {
    axios.post('http://localhost:5000/api/cart/add', { userId, productId, quantity: 1 })
      .then(() => axios.get(`http://localhost:5000/api/cart/${userId}`))
      .then(res => setCart(res.data))
      .catch(err => alert('Failed to add to cart'));
  };

  const removeFromCart = (productId) => {
    axios.post('http://localhost:5000/api/cart/remove', { userId, productId })
      .then(() => axios.get(`http://localhost:5000/api/cart/${userId}`))
      .then(res => setCart(res.data))
      .catch(err => alert('Failed to remove from cart'));
  };

  const addToWishlist = (productId) => {
    axios.post('http://localhost:5000/api/wishlist/add', { userId, productId })
      .then(() => axios.get(`http://localhost:5000/api/wishlist/${userId}`))
      .then(res => setWishlist(res.data))
      .catch(err => alert('Failed to add to wishlist'));
  };

  const removeFromWishlist = (productId) => {
    axios.post('http://localhost:5000/api/wishlist/remove', { userId, productId })
      .then(() => axios.get(`http://localhost:5000/api/wishlist/${userId}`))
      .then(res => setWishlist(res.data))
      .catch(err => alert('Failed to remove from wishlist'));
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Products</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 15 }}>
        {products.map(p => (
          <div key={p._id} style={{ border: '1px solid #ccc', padding: 10, width: 200 }}>
            <h3>{p.name}</h3>
            <p>Price: ₹{p.price}</p>
            <button onClick={() => addToCart(p._id)}>Add to Cart</button>
            <button onClick={() => addToWishlist(p._id)}>Add to Wishlist</button>
          </div>
        ))}
      </div>

      <h2>Cart</h2>
      {cart.length === 0 ? <p>No items in cart</p> : (
        <ul>
          {cart.map(item => (
            <li key={item._id}>
              {item.productId?.name || 'Product not found'} (Qty: {item.quantity})
              <button onClick={() => removeFromCart(item.productId._id)}>Remove</button>
            </li>
          ))}
        </ul>
      )}

      <h2>Wishlist</h2>
      {wishlist.length === 0 ? <p>No items in wishlist</p> : (
        <ul>
          {wishlist.map(item => (
            <li key={item._id}>
              {item.productId?.name || 'Product not found'}
              <button onClick={() => removeFromWishlist(item.productId._id)}>Remove</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;
