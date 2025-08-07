import React from 'react';
import { data } from '../restApi.json';
import './Orders.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const prices = [
  350, 280, 220, 180, 250, 200, 300, 270 // Example prices for each dish
];

const Orders = () => {
  const navigate = useNavigate();

  const handleAddToCart = async (dish, price) => {
    const email = localStorage.getItem('userEmail') || '';
    if (!email) {
      alert('Please log in to add items to your cart.');
      navigate('/login');
      return;
    }
    try {
      await axios.post('http://localhost:4000/api/v1/cart/add', {
        email,
        item: {
          dishId: dish.id,
          title: dish.title,
          price: price,
          quantity: 1,
          image: dish.image
        }
      }, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true
      });
      alert('Added to cart!');
    } catch (err) {
      alert('Failed to add to cart.');
    }
  };

  return (
    <section className='orders' id='orders'>
      <nav className='orders-navbar'>
        <span className='orders-logo'>Pichuka Restaurant</span>
        <button className='orders-home-btn' onClick={() => navigate('/home')}>Home</button>
        <button className='orders-cart-btn' onClick={() => navigate('/cart')}>Cart</button>
      </nav>
      <div className='container'>
        <div className='heading_section'>
          <h1 className='heading'>ORDER YOUR FAVORITE DISH</h1>
          <p>Choose from our delicious menu and place your order now!</p>
        </div>
        <div className="orders-grid">
          {data[0].dishes.map((dish, idx) => (
            <div className='order-card' key={dish.id}>
              <img src={dish.image} alt={dish.title} className='order-img' />
              <h3>{dish.title}</h3>
              <p className='order-category'>{dish.category}</p>
              <p className='order-price'><strong>Price: ₹{prices[idx] || 200}</strong></p>
              <button className='order-btn' onClick={() => handleAddToCart(dish, prices[idx] || 200)}>Add to Cart</button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Orders;