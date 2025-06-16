// frontend/src/components/Orders.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { getUser } from '../utils/auth';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const user = getUser();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/orders/user/${user._id}`);
        setOrders(res.data);
      } catch (err) {
        console.error('Failed to fetch orders:', err);
      }
    };

    if (user) fetchOrders();
  }, [user]);

  return (
    <div>
      <h2>My Orders</h2>
      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <ul>
          {orders.map(order => (
  <li key={order._id}>
    {order.productId ? (
      <>
        <strong>{order.productId.name}</strong> — Size: {order.size}, Quantity: {order.quantity}
        <br />
        <small>Ordered on: {new Date(order.createdAt).toLocaleDateString()}</small>
      </>
    ) : (
      <em>Product not found (may have been deleted)</em>
    )}
  </li>
))}

        </ul>
      )}
    </div>
  );
};

export default Orders;
