import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { getUser } from '../utils/auth';
import './Products.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';  // import navigate hook

const Products = () => {
  const [products, setProducts] = useState([]);
  const [orderProduct, setOrderProduct] = useState(null);
  const [size, setSize] = useState('');
  const [quantity, setQuantity] = useState(1);

  const user = getUser();
  const navigate = useNavigate();  // initialize navigate

  useEffect(() => {
    axios.get('http://localhost:5000/api/products')
      .then(res => setProducts(res.data))
      .catch(err => console.error('Failed to fetch products', err));
  }, []);

  const handleAddToCart = async (productId) => {
    try {
      const res = await axios.post('http://localhost:5000/api/cart/add', {
        userId: user._id,
        productId,
      });
      alert(res.data.message);
    } catch (err) {
      alert(err.response?.data?.message || 'Error adding to cart');
    }
  };

  const handleAddToWishlist = (product) => {
    if (!user) return toast.error('Please login to add to wishlist');

    axios.post('http://localhost:5000/api/wishlist/add', {
      userId: user._id,
      productId: product._id
    })
      .then(() => toast.success(`${product.name} added to wishlist!`))
      .catch(err => {
        if (err.response && err.response.status === 400) {
          toast.info(`${product.name} is already in wishlist`);
        } else {
          toast.error('Failed to add to wishlist');
        }
      });
  };

  const handleOrderNowClick = (product) => {
    if (!user) return toast.error('Please login to order');
    setOrderProduct(product);
    setSize('');
    setQuantity(1);
  };

  const handleConfirmOrder = async () => {
    if (!size || quantity < 1) {
      toast.error('Please select valid size and quantity');
      return;
    }

    try {
      const res = await axios.post('http://localhost:5000/api/orders/place', {
        userId: user._id,
        productId: orderProduct._id,
        size,
        quantity,
      });

      toast.success('Order placed successfully!');
      setOrderProduct(null);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Order failed');
    }
  };

  // New handler for clicking on product card to go to product details
  const handleProductClick = (productId) => {
    navigate(`/products/${productId}`);
  };

  return (
    <div className="products-container">
      <ToastContainer />
      <h2 className="products-title">Our Products</h2>
      <div className="products-grid">
        {products.map(product => (
          <div
            className="product-card"
            key={product._id}
            // Make the card clickable but prevent clicks on buttons from triggering this
            onClick={(e) => {
              // Avoid triggering navigation if a button inside was clicked
              if (e.target.tagName !== 'BUTTON' && e.target.className !== 'heart-icon') {
                handleProductClick(product._id);
              }
            }}
          >
            <span className="heart-icon" onClick={(e) => { e.stopPropagation(); handleAddToWishlist(product); }}>❤️</span>
            <img src={product.image} alt={product.name} className="product-image" />
            <h3>{product.name}</h3>
            <p className="description">{product.description}</p>
            <p className="price">₹{product.price}</p>
            <button className="btn" onClick={(e) => { e.stopPropagation(); handleAddToCart(product._id); }}>Add to Cart</button>
            <button className="btn btn-order" onClick={(e) => { e.stopPropagation(); handleOrderNowClick(product); }}>Order Now</button>
          </div>
        ))}
      </div>

      {orderProduct && (
        <div className="order-popup">
          <h3>Order: {orderProduct.name}</h3>
          <label>
            Size:
            <select value={size} onChange={(e) => setSize(e.target.value)}>
              <option value="">Select Size</option>
              <option value="S">Small</option>
              <option value="M">Medium</option>
              <option value="L">Large</option>
              <option value="XL">XL</option>
            </select>
          </label>
          <label>
            Quantity:
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />
          </label>
          <div className="order-actions">
            <button onClick={handleConfirmOrder} className="btn">Confirm Order</button>
            <button onClick={() => setOrderProduct(null)} className="btn btn-cancel">Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
