import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { API_ENDPOINTS } from '../config/api.js';
import './ChefStyles.css';

const ChefKitchenQueue = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
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
        // Filter orders to show only CONFIRMED, PREPARING, and READY orders
        const kitchenOrders = response.data.orders.filter(order => 
          ['Confirmed', 'Preparing', 'Ready'].includes(order.status)
        );
        setOrders(kitchenOrders);
      }
    } catch (error) {
      toast.error('Failed to fetch kitchen orders');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      const response = await axios.put(API_ENDPOINTS.ORDERS_STATUS, {
        orderId,
        status: newStatus,
        updatedBy: chefName
      });

      if (response.data.success) {
        toast.success(`Order status updated to ${newStatus}`);
        fetchOrders(); // Refresh orders
      }
    } catch (error) {
      toast.error('Failed to update order status');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Confirmed': return '#3b82f6';
      case 'Preparing': return '#f97316';
      case 'Ready': return '#10b981';
      case 'Delivered': return '#059669';
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

  const getNextStatus = (currentStatus) => {
    switch (currentStatus) {
      case 'Confirmed':
        return 'Preparing';
      case 'Preparing':
        return 'Ready';
      default:
        return null;
    }
  };

  const getStatusProgress = (status) => {
    switch (status) {
      case 'Confirmed': return 33;
      case 'Preparing': return 66;
      case 'Ready': return 100;
      default: return 0;
    }
  };

  if (loading) {
    return (
      <div className="chef-container">
        <div className="loading">🍳 Loading kitchen queue...</div>
      </div>
    );
  }

  return (
    <div className="chef-container">
      <header className="chef-header">
        <div className="chef-header-content">
          <h1 className="chef-title">🍳 Kitchen Queue</h1>
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
            className="nav-btn"
            onClick={() => navigate('/chef-dashboard')}
          >
            🏠 Dashboard
          </button>
          <button 
            className="nav-btn active"
            onClick={() => navigate('/chef/kitchen-queue')}
          >
            🍳 Kitchen Queue
          </button>
        </div>
      </nav>

      <main className="chef-main">
        {/* Kitchen Stats */}
        <div className="chef-stats-grid">
          <div className="stat-card">
            <h2 className="stat-number">{orders.filter(o => o.status === 'Confirmed').length}</h2>
            <p className="stat-label">📋 Confirmed Orders</p>
          </div>
          <div className="stat-card">
            <h2 className="stat-number">{orders.filter(o => o.status === 'Preparing').length}</h2>
            <p className="stat-label">🍳 Currently Preparing</p>
          </div>
          <div className="stat-card">
            <h2 className="stat-number">{orders.filter(o => o.status === 'Ready').length}</h2>
            <p className="stat-label">✅ Ready to Serve</p>
          </div>
          <div className="stat-card">
            <h2 className="stat-number">{orders.length}</h2>
            <p className="stat-label">🔢 Total in Queue</p>
          </div>
        </div>

        <div className="section-header">
          <h2 className="section-title">🍳 Kitchen Queue</h2>
          <p className="section-subtitle">Manage confirmed orders and track cooking progress</p>
        </div>

        <div className="orders-grid">
          {orders.length === 0 ? (
            <div className="no-orders">
              <h3>Kitchen queue is empty</h3>
              <p>No confirmed orders in the kitchen queue at the moment.</p>
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
                      {order.status === 'Confirmed' && '📋'}
                      {order.status === 'Preparing' && '🍳'}
                      {order.status === 'Ready' && '✅'}
                      {' '}{order.status}
                    </div>
                    {/* Enhanced Progress Bar */}
                    <div className="progress-container">
                      <div className="progress-bar">
                        <div 
                          className="progress-fill"
                          style={{
                            width: `${getStatusProgress(order.status)}%`,
                            backgroundColor: getStatusColor(order.status)
                          }}
                        />
                      </div>
                      <p className="progress-text">
                        Progress: {getStatusProgress(order.status)}%
                      </p>
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
                  
                  {getNextStatus(order.status) && (
                    <button
                      className={`action-btn ${order.status === 'Preparing' ? 'preparing' : ''}`}
                      onClick={() => handleStatusUpdate(order.orderId, getNextStatus(order.status))}
                    >
                      {order.status === 'Confirmed' && '🍳 Start Preparing'}
                      {order.status === 'Preparing' && '✅ Mark Ready'}
                    </button>
                  )}
                  
                  {order.status === 'Ready' && (
                    <div className="ready-indicator">
                      ✅ Ready for Pickup/Delivery
                    </div>
                  )}
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

export default ChefKitchenQueue;
