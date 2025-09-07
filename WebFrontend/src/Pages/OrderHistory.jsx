import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { API_ENDPOINTS } from '../config/api';
import StaffNavbar from '../components/StaffNavbar';
import './ChefStyles.css';

const OrderHistory = () => {
  const navigate = useNavigate();
  const [deliveredOrders, setDeliveredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrders, setExpandedOrders] = useState(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('all');

  useEffect(() => {
    checkStaffAuth();
    fetchDeliveredOrders();
  }, [navigate]);

  const checkStaffAuth = () => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const userRole = localStorage.getItem('userRole');
    const staffRoles = ['Manager', 'Supervisor', 'Cashier', 'Waiter'];
    
    if (!isLoggedIn || !staffRoles.includes(userRole)) {
      toast.error('Access denied. Staff login required.');
      navigate('/login');
      return;
    }
  };

  const fetchDeliveredOrders = async () => {
    try {
      const response = await axios.get(API_ENDPOINTS.ORDERS_ALL);
      if (response.data.success) {
        const allOrders = response.data.orders || [];
        // Filter only delivered orders
        const delivered = allOrders.filter(order => order.status === 'Delivered');
        // Sort by most recent first
        const sortedOrders = delivered.sort((a, b) => 
          new Date(b.orderDate) - new Date(a.orderDate)
        );
        setDeliveredOrders(sortedOrders);
      }
    } catch (error) {
      console.error('Error fetching delivered orders:', error);
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
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDeliveryTime = (dateString) => {
    const now = new Date();
    const deliveryTime = new Date(dateString);
    const diffHours = Math.floor((now - deliveryTime) / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffHours < 1) {
      const diffMinutes = Math.floor((now - deliveryTime) / (1000 * 60));
      return `${diffMinutes} min ago`;
    } else if (diffHours < 24) {
      return `${diffHours}h ago`;
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return formatDate(dateString);
    }
  };

  const getCustomerName = (email) => {
    return email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const getTableNumber = (orderId) => {
    const hash = orderId.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    return Math.abs(hash % 20) + 1;
  };

  const filterOrdersByDate = (orders, filter) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);
    const monthAgo = new Date(today);
    monthAgo.setMonth(monthAgo.getMonth() - 1);

    switch (filter) {
      case 'today':
        return orders.filter(order => new Date(order.orderDate) >= today);
      case 'yesterday':
        return orders.filter(order => {
          const orderDate = new Date(order.orderDate);
          return orderDate >= yesterday && orderDate < today;
        });
      case 'week':
        return orders.filter(order => new Date(order.orderDate) >= weekAgo);
      case 'month':
        return orders.filter(order => new Date(order.orderDate) >= monthAgo);
      default:
        return orders;
    }
  };

  const filteredOrders = deliveredOrders.filter(order => 
    order.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const dateFilteredOrders = filterOrdersByDate(filteredOrders, dateFilter);

  const getTotalRevenue = (orders) => {
    return orders.reduce((sum, order) => sum + order.totalPrice, 0);
  };

  if (loading) {
    return (
      <div className="chef-container">
        <StaffNavbar />
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading order history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="chef-container">
      <StaffNavbar />
      
      <header className="chef-header">
        <div className="chef-header-content">
          <div className="chef-info">
            <div className="chef-avatar">📚</div>
            <div className="chef-details">
              <h1 className="chef-title">Order History</h1>
              <p className="chef-subtitle">Complete record of delivered orders</p>
            </div>
          </div>
          <div className="history-stats">
            <div className="stat-badge">
              <span className="stat-number">{dateFilteredOrders.length}</span>
              <span className="stat-label">Delivered</span>
            </div>
            <div className="stat-badge">
              <span className="stat-number">₹{getTotalRevenue(dateFilteredOrders)}</span>
              <span className="stat-label">Revenue</span>
            </div>
          </div>
        </div>
      </header>

      <main className="chef-main">
        {/* Filters Section */}
        <section className="section">
          <div className="history-filters">
            <div className="search-box">
              <input
                type="text"
                placeholder="Search by Order ID or Customer Email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
            
            <div className="filter-group">
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="filter-select"
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="yesterday">Yesterday</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
              </select>
            </div>
          </div>
        </section>

        {/* Order History */}
        <section className="section">
          <h2 className="section-title">
            Delivered Orders ({dateFilteredOrders.length})
          </h2>
          
          {dateFilteredOrders.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📋</div>
              <h3>No delivered orders found</h3>
              <p>No orders match your current search and filter criteria.</p>
            </div>
          ) : (
            <div className="history-container">
              <div className="history-scroll">
                {dateFilteredOrders.map((order) => {
                  const isExpanded = expandedOrders.has(order.orderId);
                  
                  return (
                    <div key={order.orderId} className="history-order-card">
                      {/* Collapsible Header */}
                      <div 
                        className="history-order-header"
                        onClick={() => toggleOrderExpansion(order.orderId)}
                      >
                        <div className="order-summary">
                          <div className="order-main-info">
                            <h3 className="order-id">#{order.orderId}</h3>
                            <span className="delivered-badge">✅ Delivered</span>
                          </div>
                          
                          <div className="order-quick-info">
                            <span className="customer-name">
                              👤 {getCustomerName(order.email)}
                            </span>
                            <span className="table-number">
                              🪑 Table #{getTableNumber(order.orderId)}
                            </span>
                            <span className="delivery-time">
                              🕒 {formatDeliveryTime(order.orderDate)}
                            </span>
                            <span className="order-total-quick">
                              💰 ₹{order.totalPrice}
                            </span>
                          </div>
                        </div>
                        
                        <div className="expand-icon">
                          {isExpanded ? '▼' : '▶'}
                        </div>
                      </div>

                      {/* Expandable Content */}
                      {isExpanded && (
                        <div className="history-order-details">
                          {/* Customer & Order Info */}
                          <div className="order-info-grid">
                            <div className="info-item">
                              <span className="info-label">📧 Customer Email:</span>
                              <span className="info-value">{order.email}</span>
                            </div>
                            <div className="info-item">
                              <span className="info-label">📅 Order Date:</span>
                              <span className="info-value">{formatDate(order.orderDate)}</span>
                            </div>
                            <div className="info-item">
                              <span className="info-label">🪑 Table Number:</span>
                              <span className="info-value">#{getTableNumber(order.orderId)}</span>
                            </div>
                            <div className="info-item">
                              <span className="info-label">🚚 Delivery Time:</span>
                              <span className="info-value">{formatDeliveryTime(order.orderDate)}</span>
                            </div>
                          </div>

                          {/* Order Items */}
                          <div className="order-items-section">
                            <h4 className="items-title">🍽️ Order Items:</h4>
                            <div className="items-grid">
                              {order.items.map((item, index) => (
                                <div key={index} className="history-item">
                                  <div className="item-info">
                                    <span className="item-name">{item.title}</span>
                                    <span className="item-quantity">x{item.quantity}</span>
                                  </div>
                                  <div className="item-pricing">
                                    <span className="item-unit-price">₹{item.price} each</span>
                                    <span className="item-total-price">₹{item.price * item.quantity}</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Order Total */}
                          <div className="order-total-section">
                            <div className="total-breakdown">
                              <div className="total-row">
                                <span className="total-label">Items ({order.items.length}):</span>
                                <span className="total-value">₹{order.totalPrice}</span>
                              </div>
                              <div className="total-row final-total">
                                <span className="total-label">Total Amount:</span>
                                <span className="total-value">₹{order.totalPrice}</span>
                              </div>
                            </div>
                          </div>

                          {/* Order Notes */}
                          {order.notes && (
                            <div className="order-notes-section">
                              <span className="notes-label">📝 Notes:</span>
                              <span className="notes-text">{order.notes}</span>
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
        </section>
      </main>
    </div>
  );
};

export default OrderHistory;