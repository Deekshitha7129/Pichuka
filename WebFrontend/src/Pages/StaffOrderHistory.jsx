import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { API_ENDPOINTS } from '../config/api';
import StaffNavbar from '../components/StaffNavbar';
import './ChefStyles.css';

const StaffOrderHistory = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    checkStaffAuth();
    fetchOrders();
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

  const fetchOrders = async () => {
    try {
      const response = await axios.get(API_ENDPOINTS.ORDERS_ALL);
      if (response.data.success) {
        const allOrders = response.data.orders || [];
        // Sort by date (newest first)
        const sortedOrders = allOrders.sort((a, b) => 
          new Date(b.orderDate) - new Date(a.orderDate)
        );
        setOrders(sortedOrders);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to fetch order history');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Pending': return 'status-pending';
      case 'Confirmed': return 'status-confirmed';
      case 'Preparing': return 'status-preparing';
      case 'Ready': return 'status-ready';
      case 'Delivered': return 'status-delivered';
      case 'Cancelled': return 'status-cancelled';
      default: return 'status-pending';
    }
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

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const dateFilteredOrders = filterOrdersByDate(filteredOrders, dateFilter);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getOrderStats = (orders) => {
    return {
      total: orders.length,
      delivered: orders.filter(order => order.status === 'Delivered').length,
      cancelled: orders.filter(order => order.status === 'Cancelled').length,
      totalRevenue: orders
        .filter(order => order.status === 'Delivered')
        .reduce((sum, order) => sum + order.totalPrice, 0)
    };
  };

  const stats = getOrderStats(dateFilteredOrders);

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
              <p className="chef-subtitle">Complete record of all customer orders</p>
            </div>
          </div>
        </div>
      </header>

      <main className="chef-main">
        {/* Stats Section */}
        <section className="section">
          <h2 className="section-title">History Overview</h2>
          <div className="chef-stats-grid">
            <div className="stat-card">
              <div className="stat-icon">📊</div>
              <div className="stat-content">
                <div className="stat-number">{stats.total}</div>
                <div className="stat-label">Total Orders</div>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon">✅</div>
              <div className="stat-content">
                <div className="stat-number">{stats.delivered}</div>
                <div className="stat-label">Delivered</div>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon">❌</div>
              <div className="stat-content">
                <div className="stat-number">{stats.cancelled}</div>
                <div className="stat-label">Cancelled</div>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon">💰</div>
              <div className="stat-content">
                <div className="stat-number">₹{stats.totalRevenue}</div>
                <div className="stat-label">Revenue</div>
              </div>
            </div>
          </div>
        </section>

        {/* Filters Section */}
        <section className="section">
          <div className="filters-container">
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
              
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="filter-select"
              >
                <option value="all">All Status</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="preparing">Preparing</option>
                <option value="ready">Ready</option>
              </select>
            </div>
          </div>
        </section>

        {/* Orders History */}
        <section className="section">
          <h2 className="section-title">
            Order History ({dateFilteredOrders.length})
          </h2>
          
          {dateFilteredOrders.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📋</div>
              <h3>No orders found</h3>
              <p>No orders match your current search and filter criteria.</p>
            </div>
          ) : (
            <div className="orders-grid">
              {dateFilteredOrders.map((order) => (
                <div key={order.orderId} className="order-card">
                  <div className="order-header">
                    <div className="order-id">
                      <h3>#{order.orderId}</h3>
                      <span className={`status-badge ${getStatusBadgeClass(order.status)}`}>
                        {order.status}
                      </span>
                    </div>
                    <div className="order-time">
                      {formatDate(order.orderDate)}
                    </div>
                  </div>

                  <div className="order-customer">
                    <span className="customer-label">👤 Customer:</span>
                    <span className="customer-email">{order.email}</span>
                  </div>

                  <div className="order-items-summary">
                    <span className="items-label">🍽️ Items:</span>
                    <span className="items-count">{order.items.length} item(s)</span>
                  </div>

                  <div className="order-total">
                    <span className="total-label">💰 Total:</span>
                    <span className="total-amount">₹{order.totalPrice}</span>
                  </div>

                  {/* Order Items Details */}
                  <div className="order-items-details">
                    {order.items.map((item, index) => (
                      <div key={index} className="order-item-detail">
                        <span className="item-name">{item.title}</span>
                        <span className="item-details">
                          {item.quantity} × ₹{item.price}
                        </span>
                      </div>
                    ))}
                  </div>

                  {order.notes && (
                    <div className="order-notes">
                      <span className="notes-label">📝 Notes:</span>
                      <span className="notes-text">{order.notes}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default StaffOrderHistory;
