import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { API_ENDPOINTS } from '../config/api.js';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Cart = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCart = async () => {
      const email = localStorage.getItem('userEmail');
      if (!email) {
        setCartItems([]);
        setLoading(false);
        return;
      }
      try {
        const response = await axios.get(`${API_ENDPOINTS.CART_GET}?email=${email}`);
        setCartItems(response.data.cart?.items || []);
      } catch (err) {
        setCartItems([]);
      }
      setLoading(false);
    };
    fetchCart();
  }, []);

  const getTotal = () => cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleCheckout = async () => {
    const email = localStorage.getItem('userEmail');
    if (!email) {
      toast.error('Please login to checkout');
      return;
    }

    try {
      const response = await axios.post(API_ENDPOINTS.ORDERS_PLACE, { email });
      if (response.data.success) {
        toast.success('Order placed successfully!');
        setCartItems([]);
        // Navigate to order tracking with the new order ID
        navigate(`/track-order?orderId=${response.data.order.orderId}`);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to place order');
    }
  };

  return (
    <section className='orders' id='cart'>
      <nav className='orders-navbar'>
        <span className='orders-logo'>Pichuka Restaurant</span>
        <button className='orders-home-btn' onClick={() => navigate('/home')}>Home</button>
        <button className='orders-cart-btn' onClick={() => navigate('/cart')}>Cart</button>
        <button className='orders-orders-btn' onClick={() => navigate('/orders')}>Back to Orders</button>
      </nav>
      <div className='container'>
        <div className='heading_section'>
          <h1 className='heading'>YOUR CART</h1>
          <p>All your selected dishes are listed below.</p>
        </div>
        {loading ? (
          <p>Loading...</p>
        ) : cartItems.length === 0 ? (
          <p style={{ textAlign: 'center', fontSize: '1.2rem', marginTop: '2rem' }}>Your cart is empty.</p>
        ) : (
          <>
            <div className='orders-grid'>
              {cartItems.map((item) => (
                <div className='order-card' key={item.dishId}>
                  <img src={item.image} alt={item.title} className='order-img' />
                  <h3>{item.title}</h3>
                  <p className='order-category'>Quantity: {item.quantity}</p>
                  <p className='order-price'><strong>Price: ₹{item.price}</strong></p>
                  <p className='order-price'><strong>Subtotal: ₹{item.price * item.quantity}</strong></p>
                </div>
              ))}
            </div>
            <div className='cart-total-box'>
              <h2>Total: ₹{getTotal()}</h2>
              <button className='order-btn' style={{ marginTop: '1rem', width: '200px' }} onClick={handleCheckout}>Checkout</button>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default Cart; 