// frontend/src/pages/Wishlist.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { getUser } from '../utils/auth';
import './Wishlist.css';

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const user = getUser();

  useEffect(() => {
    if (user) {
      axios.get(`http://localhost:5000/api/wishlist/${user._id}`)
        .then(res => setWishlist(res.data))
        .catch(err => console.error('Error fetching wishlist:', err));
    }
  }, [user]);

  // ✅ Add this remove handler function
  const handleRemove = async (wishlistItemId) => {
    try {
      await axios.delete(`http://localhost:5000/api/wishlist/remove/${wishlistItemId}`);
      setWishlist(prev => prev.filter(item => item._id !== wishlistItemId));
    } catch (err) {
      console.error('Error removing wishlist item:', err);
    }
  };

  return (
    <div className="wishlist-container">
      <h2>My Wishlist</h2>
      {wishlist.length === 0 ? (
        <p>No items in wishlist</p>
      ) : (
        <div className="wishlist-grid">
          {wishlist
            .filter(item => item.productId) // only show valid product entries
            .map(item => (
              <div className="product-card" key={item._id}>
                <img
                  src={item.productId.image}
                  alt={item.productId.name}
                  className="product-image"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://via.placeholder.com/150';
                  }}
                />
                <h3>{item.productId.name}</h3>
                <p>₹{item.productId.price}</p>
                <button
                  className="remove-button"
                  onClick={() => handleRemove(item._id)}
                >
                  Remove
                </button>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
