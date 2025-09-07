import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { API_ENDPOINTS } from '../config/api.js';
import './ChefStyles.css';

const ChefDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  // Removed filter state since we only show pending orders
  const navigate = useNavigate();
  const chefName = localStorage.getItem('userName');
  const chefEmail = localStorage.getItem('userEmail');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get(API_ENDPOINTS.ORDERS_ALL);
      if (response.data.success) {
        // Filter orders to show only PENDING orders for chef dashboard
        const pendingOrders = response.data.orders.filter(order => 
          order.status === 'Pending'
        );
        setOrders(pendingOrders);
      }
    } catch (error) {
      toast.error('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmOrder = async (orderId) => {
    try {
      const response = await axios.put(API_ENDPOINTS.ORDERS_STATUS, {
        orderId,
        status: 'Confirmed',
        updatedBy: chefName
      });

      if (response.data.success) {
        toast.success('Order confirmed! It will appear in Kitchen Queue.');
        fetchOrders(); // Refresh orders to remove confirmed order from dashboard
      }
    } catch (error) {
      toast.error('Failed to confirm order');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return '#f59e0b';
      case 'Confirmed': return '#3b82f6';
      case 'Preparing': return '#f97316';
      case 'Ready': return '#10b981';
      case 'Delivered': return '#059669';
      case 'Cancelled': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // No filtering needed since we only fetch pending orders

  const canChefUpdate = (status) => {
    return ['Pending', 'Confirmed', 'Preparing', 'Ready'].includes(status);
  };

  const getNextStatus = (currentStatus) => {
    switch (currentStatus) {
      case 'Pending':
      case 'Confirmed':
        return 'Preparing';
      case 'Preparing':
        return 'Ready';
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="chef-dashboard">
        <div className="loading">Loading orders...</div>
      </div>
    );
  }

  return (
    <div className="chef-container">
      <header className="chef-header">
        <div className="chef-header-content">
          <h1 className="chef-title">Chef Dashboard</h1>
          <div className="chef-info">
            <div className="chef-profile">
              <div className="chef-avatar">
                {chefName?.charAt(0)?.toUpperCase() || 'C'}
              </div>
              <div className="chef-details">
                <h3>{chefName || 'Chef'}</h3>
                <p>{chefEmail}</p>
              </div>
            </div>
            <button 
              className="logout-btn"
              onClick={() => {
                localStorage.clear();
                navigate('/');
              }}
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <nav className="chef-nav">
        <div className="chef-nav-container">
          <button 
            className="nav-btn active"
            onClick={() => navigate('/chef-dashboard')}
          >
            🏠 Dashboard
          </button>
          <button 
            className="nav-btn"
            onClick={() => navigate('/chef/kitchen-queue')}
          >
            🍳 Kitchen Queue
          </button>
        </div>
      </nav>

      <main className="chef-main">
        {/* Quick Stats */}
        <div className="chef-stats-grid">
          <div className="stat-card">
            <h2 className="stat-number">{orders.length}</h2>
            <p className="stat-label">🔔 New Order Requests</p>
          </div>
          <div className="stat-card">
            <h2 className="stat-number">Active</h2>
            <p className="stat-label">👨‍🍳 Chef Status</p>
          </div>
          <div className="stat-card">
            <h2 className="stat-number">{new Date().toLocaleDateString()}</h2>
            <p className="stat-label">📅 Today's Date</p>
          </div>
          <div className="stat-card">
            <h2 className="stat-number">{new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</h2>
            <p className="stat-label">⏰ Current Time</p>
          </div>
        </div>
        <div className="section-header">
          <h2 className="section-title">🍽️ New Order Requests</h2>
          <p className="section-subtitle">Review and confirm incoming orders from customers</p>
        </div>

        <div className="orders-grid">
          {orders.length === 0 ? (
            <div className="no-orders">
              <h3>No pending orders</h3>
              <p>All caught up! No new order requests at the moment.</p>
            </div>
          ) : (
            orders.map((order) => (
              <div key={order._id} className="order-card">
                <div className="order-header">
                  <div className="order-info">
                    <h3 className="order-id">Order #{order.orderId}</h3>
                    <p className="order-time">{formatDate(order.orderDate)}</p>
                    <p className="customer-email">👤 {order.email}</p>
                  </div>
                  <div className="status-section">
                    <div 
                      className="status-badge" 
                      style={{ backgroundColor: getStatusColor(order.status) }}
                    >
                      ⏳ {order.status}
                    </div>
                  </div>
                </div>

                <div className="order-items">
                  <h4 className="items-title">🍽️ Order Items</h4>
                  <div className="items-list">
                    {order.items.map((item, index) => (
                      <div key={index} className="order-item">
                        <span className="item-name">{item.title}</span>
                        <span className="item-quantity">×{item.quantity}</span>
                        <span className="item-price">₹{item.price}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="order-footer">
                  <div className="order-total">
                    💰 Total: ₹{order.totalPrice}
                  </div>
                  
                  <button
                    className="action-btn"
                    onClick={() => handleConfirmOrder(order.orderId)}
                  >
                    ✅ Confirm Order
                  </button>
                </div>

                {order.notes && (
                  <div className="order-notes">
                    <strong>📝 Notes:</strong> {order.notes}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
};

export default ChefDashboard; 