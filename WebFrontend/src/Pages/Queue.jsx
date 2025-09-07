import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { API_ENDPOINTS } from '../config/api';
import StaffNavbar from '../components/StaffNavbar';
import './ChefStyles.css';

const Queue = () => {
  const navigate = useNavigate();
  const [readyOrders, setReadyOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deliveryLoading, setDeliveryLoading] = useState({});

  useEffect(() => {
    checkStaffAuth();
    fetchReadyOrders();
    
    // Set up polling for real-time updates
    const interval = setInterval(fetchReadyOrders, 15000); // Update every 15 seconds
    return () => clearInterval(interval);
  }, [navigate]);

  const checkStaffAuth = () => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const userRole = localStorage.getItem('userRole');
    // Only non-chef staff can access this queue (delivery management)
    const allowedStaffRoles = ['Manager', 'Supervisor', 'Cashier', 'Waiter'];
    
    if (!isLoggedIn) {
      toast.error('Please log in to access the delivery queue.');
      navigate('/login');
      return;
    }
    
    if (!allowedStaffRoles.includes(userRole)) {
      toast.error('Access denied. This page is only for non-chef staff members.');
      navigate('/login');
      return;
    }
  };

  const fetchReadyOrders = async () => {
    try {
      const response = await axios.get(API_ENDPOINTS.ORDERS_ALL);
      if (response.data.success) {
        const allOrders = response.data.orders || [];
        // Filter only orders with 'Ready' status
        const readyOrdersList = allOrders.filter(order => order.status === 'Ready');
        // Sort by order date (oldest first - FIFO)
        const sortedOrders = readyOrdersList.sort((a, b) => 
          new Date(a.orderDate) - new Date(b.orderDate)
        );
        setReadyOrders(sortedOrders);
      }
    } catch (error) {
      console.error('Error fetching ready orders:', error);
      toast.error('Failed to fetch ready orders');
    } finally {
      setLoading(false);
    }
  };

  const markAsDelivered = async (orderId) => {
    setDeliveryLoading(prev => ({ ...prev, [orderId]: true }));
    
    try {
      // Get user authentication data from localStorage
      const userEmail = localStorage.getItem('userEmail');
      const userRole = localStorage.getItem('userRole'); // This will be the position (Manager, Supervisor, Cashier, Waiter)
      const userName = localStorage.getItem('userName');
      
      // Use the secure employee-only endpoint
      const response = await axios.put(API_ENDPOINTS.ORDERS_MARK_DELIVERED, {
        orderId,
        userEmail,
        userRole: 'Employee', // All staff have role 'Employee' in the database
        userPosition: userRole // The actual position (Manager, Supervisor, Cashier, Waiter)
      });
      
      if (response.data.success) {
        toast.success('Order marked as delivered ✅');
        // Remove the order from the queue immediately (automatically moves to Order History)
        setReadyOrders(prev => prev.filter(order => order.orderId !== orderId));
      } else {
        toast.error(response.data.message || 'Failed to mark order as delivered');
      }
    } catch (error) {
      console.error('Delivery error:', error);
      if (error.response?.status === 403) {
        toast.error('Access denied. Only staff members can mark orders as delivered.');
      } else if (error.response?.status === 400) {
        toast.error(error.response.data.message || 'Invalid request');
      } else {
        toast.error('Failed to mark order as delivered');
      }
    } finally {
      setDeliveryLoading(prev => ({ ...prev, [orderId]: false }));
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getWaitTime = (orderDate) => {
    const now = new Date();
    const orderTime = new Date(orderDate);
    const diffMinutes = Math.floor((now - orderTime) / (1000 * 60));
    
    if (diffMinutes < 60) {
      return `${diffMinutes} min ago`;
    } else {
      const hours = Math.floor(diffMinutes / 60);
      const minutes = diffMinutes % 60;
      return `${hours}h ${minutes}m ago`;
    }
  };

  const getCustomerName = (email) => {
    // Extract name from email or return first part of email
    return email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const getTableNumber = (orderId) => {
    // Generate a consistent table number based on order ID
    const hash = orderId.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    return Math.abs(hash % 20) + 1; // Table numbers 1-20
  };

  if (loading) {
    return (
      <div className="chef-container">
        <StaffNavbar />
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading delivery queue...</p>
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
            <div className="chef-avatar">🚚</div>
            <div className="chef-details">
              <h1 className="chef-title">Delivery Queue</h1>
              <p className="chef-subtitle">Orders ready for delivery</p>
            </div>
          </div>
          <div className="queue-stats">
            <div className="stat-badge">
              <span className="stat-number">{readyOrders.length}</span>
              <span className="stat-label">Ready Orders</span>
            </div>
          </div>
        </div>
      </header>

      <main className="chef-main">
        {/* Queue Status */}
        <section className="section">
          <div className="queue-status">
            {readyOrders.length === 0 ? (
              <div className="empty-queue">
                <div className="empty-icon">🎉</div>
                <h3>All orders delivered!</h3>
                <p>No orders waiting for delivery at the moment.</p>
              </div>
            ) : (
              <div className="queue-info">
                <h2 className="section-title">
                  {readyOrders.length} Order{readyOrders.length !== 1 ? 's' : ''} Ready for Delivery
                </h2>
                <p className="queue-subtitle">
                  Orders are sorted by preparation time (oldest first)
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Ready Orders Grid */}
        {readyOrders.length > 0 && (
          <section className="section">
            <div className="queue-orders-grid">
              {readyOrders.map((order, index) => (
                <div key={order.orderId} className="queue-order-card">
                  {/* Priority Badge */}
                  <div className="priority-badge">
                    <span className="priority-number">#{index + 1}</span>
                    <span className="priority-label">In Queue</span>
                  </div>

                  {/* Order Header */}
                  <div className="queue-order-header">
                    <div className="order-id-section">
                      <h3 className="order-id">#{order.orderId}</h3>
                      <span className="ready-badge">🎉 Ready</span>
                    </div>
                    <div className="wait-time">
                      <span className="time-label">Wait Time:</span>
                      <span className="time-value">{getWaitTime(order.orderDate)}</span>
                    </div>
                  </div>

                  {/* Customer & Table Info */}
                  <div className="customer-table-info">
                    <div className="customer-info">
                      <span className="info-icon">👤</span>
                      <div className="info-content">
                        <span className="info-label">Customer</span>
                        <span className="info-value">{getCustomerName(order.email)}</span>
                      </div>
                    </div>
                    
                    <div className="table-info">
                      <span className="info-icon">🪑</span>
                      <div className="info-content">
                        <span className="info-label">Table</span>
                        <span className="info-value">#{getTableNumber(order.orderId)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="queue-order-items">
                    <h4 className="items-title">Order Items:</h4>
                    <div className="items-list">
                      {order.items.map((item, itemIndex) => (
                        <div key={itemIndex} className="queue-item">
                          <div className="item-info">
                            <span className="item-name">{item.title}</span>
                            <span className="item-quantity">x{item.quantity}</span>
                          </div>
                          <span className="item-price">₹{item.price * item.quantity}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Order Total */}
                  <div className="queue-order-total">
                    <span className="total-label">Total Amount:</span>
                    <span className="total-amount">₹{order.totalPrice}</span>
                  </div>

                  {/* Order Time */}
                  <div className="order-time-info">
                    <span className="time-icon">🕒</span>
                    <span className="order-time">Ordered: {formatDate(order.orderDate)}</span>
                  </div>

                  {/* Delivery Action */}
                  <div className="delivery-action">
                    <button
                      className="deliver-btn"
                      onClick={() => markAsDelivered(order.orderId)}
                      disabled={deliveryLoading[order.orderId]}
                    >
                      {deliveryLoading[order.orderId] ? (
                        <>
                          <span className="btn-spinner"></span>
                          Delivering...
                        </>
                      ) : (
                        <>
                          <span className="btn-icon">🚚</span>
                          Mark as Delivered
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

export default Queue;
