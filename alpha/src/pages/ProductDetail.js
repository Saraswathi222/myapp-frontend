import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { getUser } from '../utils/auth';
import './ProductDetail.css';  // create this CSS file for styling

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = getUser();

  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [showOrderForm, setShowOrderForm] = useState(false);

  // Address and payment details for order
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cod'); // cod = cash on delivery, 'online' for online payment

  useEffect(() => {
    axios.get(`http://localhost:5000/api/products/${id}`)
      .then(res => setProduct(res.data))
      .catch(err => {
        console.error(err);
        alert('Failed to load product details');
        navigate('/products'); // fallback if product not found
      });
  }, [id, navigate]);

  const handleOrderNow = () => {
    if (!user) {
      alert('Please login to order');
      navigate('/login');
      return;
    }
    setShowOrderForm(true);
  };

  const handlePlaceOrder = async () => {
    if (!selectedSize) {
      alert('Please select a size');
      return;
    }
    if (!selectedColor) {
      alert('Please select a color');
      return;
    }
    if (!address.trim()) {
      alert('Please enter delivery address');
      return;
    }
    if (quantity < 1) {
      alert('Quantity must be at least 1');
      return;
    }

    try {
      const orderData = {
        userId: user._id,
        productId: product._id,
        size: selectedSize,
        color: selectedColor,
        quantity,
        address,
        paymentMethod,
      };

      // API to place order — adjust endpoint as per your backend
      await axios.post('http://localhost:5000/api/orders/place', orderData);

      alert('Order placed successfully!');
      setShowOrderForm(false);
      navigate('/orders'); // redirect to orders page or anywhere you want
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to place order');
    }
  };

  if (!product) return <div>Loading product details...</div>;

  return (
    <div className="product-detail-container">
      <button className="btn-back" onClick={() => navigate(-1)}>← Back to Products</button>

      <div className="product-detail-main">
        <div className="product-images">
          {/* Show main image + more images */}
          <img src={product.image} alt={product.name} className="main-image" />
          {product.images && product.images.length > 0 && (
            <div className="more-images">
              {product.images.map((img, idx) => (
                <img key={idx} src={img} alt={`${product.name}-${idx}`} className="thumbnail" />
              ))}
            </div>
          )}
        </div>

        <div className="product-info">
          <h2>{product.name}</h2>
          <p>{product.description}</p>
          <p className="price">₹{product.price}</p>

          <div className="selectors">
            <label>
              Size:
              <select value={selectedSize} onChange={e => setSelectedSize(e.target.value)}>
                <option value="">Select Size</option>
                {product.sizes?.map(size => (
                  <option key={size} value={size}>{size}</option>
                )) || ['S', 'M', 'L', 'XL'].map(size => ( // fallback sizes
                  <option key={size} value={size}>{size}</option>
                ))}
              </select>
            </label>

            <label>
              Color:
              <select value={selectedColor} onChange={e => setSelectedColor(e.target.value)}>
                <option value="">Select Color</option>
                {product.colors?.map(color => (
                  <option key={color} value={color}>{color}</option>
                )) || ['Red', 'Blue', 'Green', 'Black'].map(color => ( // fallback colors
                  <option key={color} value={color}>{color}</option>
                ))}
              </select>
            </label>

            <label>
              Quantity:
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={e => setQuantity(Number(e.target.value))}
              />
            </label>
          </div>

          <button onClick={handleOrderNow} className="btn btn-order-now">Order Now</button>

          {showOrderForm && (
            <div className="order-form">
              <h3>Enter Delivery Details</h3>

              <label>
                Address:
                <textarea
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  placeholder="Enter your delivery address"
                  rows={3}
                />
              </label>

              <label>
                Payment Method:
                <select value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)}>
                  <option value="cod">Cash on Delivery</option>
                  <option value="online">Online Payment</option>
                </select>
              </label>

              <button onClick={handlePlaceOrder} className="btn btn-confirm-order">Place Order</button>
              <button onClick={() => setShowOrderForm(false)} className="btn btn-cancel">Cancel</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
