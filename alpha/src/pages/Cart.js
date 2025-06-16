// frontend/src/pages/Cart.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { getUser } from '../utils/auth';
import './Cart.css';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const user = getUser();

  useEffect(() => {
    if (user) {
      axios.get(`http://localhost:5000/api/cart/${user._id}`)
        .then(res => {
          setCartItems(res.data);
          const calculatedTotal = res.data.reduce((acc, item) => {
            if (item.productId) {
              return acc + item.productId.price;
            }
            return acc;
          }, 0);
          setTotal(calculatedTotal);
        })
        .catch(err => console.error('Error fetching cart:', err));
    }
  }, [user]);

  const handleRemove = async (itemId) => {
    try {
      await axios.delete(`http://localhost:5000/api/cart/remove/${itemId}`);
      const updatedCart = cartItems.filter(item => item._id !== itemId);
      setCartItems(updatedCart);
      const updatedTotal = updatedCart.reduce((acc, item) => {
        if (item.productId) {
          return acc + item.productId.price;
        }
        return acc;
      }, 0);
      setTotal(updatedTotal);
    } catch (error) {
      console.error('Failed to remove item:', error);
    }
  };

  const handlePlaceOrder = async () => {
    if (!address) {
      alert('Please enter your delivery address.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/orders/place-from-cart', {
        userId: user._id,
        address,
        paymentMethod
      });
      alert('Order placed successfully!');
      setCartItems([]);
      setTotal(0);
      setAddress('');
    } catch (error) {
      console.error('Order placement failed:', error);
      alert('Failed to place the order.');
    }
  };

  return (
    <div className="cart-container">
      <h2 className="cart-title">My Cart</h2>
      {cartItems.length === 0 ? (
        <p className="empty-cart">Your cart is empty</p>
      ) : (
        <>
          <div className="cart-grid">
            {cartItems.filter(item => item.productId).map(item => (
              <div className="cart-card" key={item._id}>
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
                <button className="remove-button" onClick={() => handleRemove(item._id)}>
                  Remove
                </button>
              </div>
            ))}
          </div>

          <div className="total-section">
            <h3>Total: ₹{total}</h3>
          </div>

          <div className="order-section">
            <h3>Place Your Order</h3>
            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter delivery address"
              rows="3"
              className="address-box"
            />
            <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} className="payment-method">
              <option value="COD">Cash on Delivery</option>
              <option value="Online">Online Payment</option>
            </select>
            <button className="place-order-button" onClick={handlePlaceOrder}>
              Place Order
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
