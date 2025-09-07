import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { API_ENDPOINTS } from '../config/api';
import Navbar from '../components/Navbar';
import './CustomerOrderHistory.css';

const CustomerOrderHistory = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrders, setExpandedOrders] = useState(new Set());

  useEffect(() => {
    checkCustomerAuth();
    fetchCustomerOrders();
  }, [navigate]);

  const checkCustomerAuth = () => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const userRole = localStorage.getItem('userRole');
    
    if (!isLoggedIn) {
      toast.error('Please log in to view your order history.');
      navigate('/login');
      return;
    }

    // Ensure this is a customer (not staff/employee)
    if (userRole === 'Employee') {
      toast.error('Access denied. Customer login required.');
      navigate('/login');
      return;
    }
  };

  const fetchCustomerOrders = async () => {
    try {
      const userEmail = localStorage.getItem('userEmail');
      if (!userEmail) {
        toast.error('User email not found. Please log in again.');
        navigate('/login');
        return;
      }

      const response = await axios.get(`${API_ENDPOINTS.ORDERS_HISTORY}?email=${userEmail}`);
      if (response.data.success) {
        // Sort by most recent first
        const sortedOrders = response.data.orders.sort((a, b) => 
          new Date(b.orderDate) - new Date(a.orderDate)
        );
        setOrders(sortedOrders);
      } else {
        toast.error('Failed to fetch order history');
      }
    } catch (error) {
      console.error('Error fetching customer orders:', error);
      toast.error('Failed to fetch order history');
    } finally {
      setLoading(false);
    }
  };

  const toggleOrderExpansion = (orderId) => {
    const newExpanded = new Set(expandedOrders);
    if (newExpanded.has(orderId)) {
      newExpanded.delete(orderId);
    } else {
      newExpanded.add(orderId);
    }
    setExpandedOrders(newExpanded);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const getStatusColor = (status) => {
    const colors = {
      'Pending': '#ffc107',
      'Confirmed': '#17a2b8',
      'Preparing': '#fd7e14',
      'Ready': '#28a745',
      'Delivered': '#6c757d',
      'Cancelled': '#dc3545'
    };
    return colors[status] || '#6c757d';
  };

  const getStatusIcon = (status) => {
    const icons = {
      'Pending': '⏳',
      'Confirmed': '✅',
      'Preparing': '👨‍🍳',
      'Ready': '🍽️',
      'Delivered': '🚚',
      'Cancelled': '❌'
    };
    return icons[status] || '📋';
  };

  if (loading) {
    return (
      <div className="customer-order-history">
        <Navbar />
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading your order history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="customer-order-history">
      <Navbar />
      <main className="main-content">
        <div className="container">
          <header className="page-header">
            <h1 className="page-title">📋 My Order History</h1>
            <p className="page-subtitle">View all your past orders and their details</p>
          </header>

          {orders.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🍽️</div>
              <h3>No Orders Yet</h3>
              <p>You haven't placed any orders yet. Start exploring our menu!</p>
              <button 
                className="cta-button"
                onClick={() => navigate('/orders')}
              >
                Browse Menu
              </button>
            </div>
          ) : (
            <div className="orders-section">
              <div className="orders-stats">
                <div className="stat-card">
                  <span className="stat-number">{orders.length}</span>
                  <span className="stat-label">Total Orders</span>
                </div>
                <div className="stat-card">
                  <span className="stat-number">
                    ₹{orders.reduce((sum, order) => sum + order.totalPrice, 0)}
                  </span>
                  <span className="stat-label">Total Spent</span>
                </div>
                <div className="stat-card">
                  <span className="stat-number">
                    {orders.filter(order => order.status === 'Delivered').length}
                  </span>
                  <span className="stat-label">Delivered</span>
                </div>
              </div>

              <div className="orders-list">
                {orders.map((order) => {
                  const isExpanded = expandedOrders.has(order.orderId);
                  return (
                    <div key={order.orderId} className="order-card">
                      <div 
                        className="order-header"
                        onClick={() => toggleOrderExpansion(order.orderId)}
                      >
                        <div className="order-main-info">
                          <div className="order-id-section">
                            <span className="order-id">#{order.orderId.split('-')[1]}</span>
                            <div 
                              className="status-badge"
                              style={{ backgroundColor: getStatusColor(order.status) }}
                            >
                              {getStatusIcon(order.status)} {order.status}
                            </div>
                          </div>
                          <div className="order-meta">
                            <span className="order-date">
                              📅 {formatDate(order.orderDate)}
                            </span>
                            <span className="order-total">💰 ₹{order.totalPrice}</span>
                            <span className="items-count">
                              🍽️ {order.items.length} item{order.items.length > 1 ? 's' : ''}
                            </span>
                          </div>
                        </div>
                        <div className="expand-icon">
                          {isExpanded ? '▼' : '▶'}
                        </div>
                      </div>

                      {/* Expandable Content */}
                      {isExpanded && (
                        <div className="order-details">
                          <div className="order-items-section">
                            <h4 className="items-title">Order Items:</h4>
                            <div className="items-list">
                              {order.items.map((item, index) => (
                                <div key={index} className="order-item">
                                  <div className="item-image">
                                    <img 
                                      src={item.image || '/placeholder-food.jpg'} 
                                      alt={item.title}
                                      onError={(e) => {
                                        e.target.src = '/placeholder-food.jpg';
                                      }}
                                    />
                                  </div>
                                  <div className="item-details">
                                    <h5 className="item-name">{item.title}</h5>
                                    <div className="item-pricing">
                                      <span className="item-quantity">Qty: {item.quantity}</span>
                                      <span className="item-unit-price">₹{item.price} each</span>
                                      <span className="item-total">₹{item.price * item.quantity}</span>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="order-summary">
                            <div className="summary-row">
                              <span className="summary-label">Items Total:</span>
                              <span className="summary-value">₹{order.totalPrice}</span>
                            </div>
                            <div className="summary-row total-row">
                              <span className="summary-label">Total Amount:</span>
                              <span className="summary-value">₹{order.totalPrice}</span>
                            </div>
                          </div>

                          {order.notes && (
                            <div className="order-notes">
                              <span className="notes-label">📝 Special Instructions:</span>
                              <p className="notes-text">{order.notes}</p>
                            </div>
                          )}

                          {order.status !== 'Delivered' && order.status !== 'Cancelled' && (
                            <div className="order-actions">
                              <button 
                                className="track-button"
                                onClick={() => navigate('/track-order')}
                              >
                                🔍 Track This Order
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default CustomerOrderHistory;
