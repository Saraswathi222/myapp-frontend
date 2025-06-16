import React from 'react';
import './Checkout.css';

const Checkout = () => {
  return (
    <div className="checkout">
      <h2>Checkout</h2>
      <form className="checkout-form">
        <label>Full Name
          <input type="text" placeholder="Enter your full name" required />
        </label>
        <label>Address
          <input type="text" placeholder="Enter your address" required />
        </label>
        <label>City
          <input type="text" placeholder="City" required />
        </label>
        <label>Postal Code
          <input type="text" placeholder="Postal Code" required />
        </label>
        <label>Payment Method
          <select>
            <option>Credit Card</option>
            <option>Debit Card</option>
            <option>Cash on Delivery</option>
          </select>
        </label>
        <button type="submit">Place Order</button>
      </form>
    </div>
  );
};

export default Checkout;