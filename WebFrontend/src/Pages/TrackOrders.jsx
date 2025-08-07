import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { API_ENDPOINTS } from '../config/api';
import StaffNavbar from '../components/StaffNavbar';
import './ChefStyles.css';
import './TrackOrders.css';

const TrackOrders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    checkStaffAuth();
    fetchOrders();
    
    // Set up polling for real-time updates
    const interval = setInterval(fetchOrders, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
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
        // Filter out delivered and cancelled orders
        const activeOrders = allOrders.filter(order => 
          !['Delivered', 'Cancelled'].includes(order.status)
        );
        // Sort by order date (newest first)
        const sortedOrders = activeOrders.sort((a, b) => 
          new Date(b.orderDate) - new Date(a.orderDate)
        );
        setOrders(sortedOrders);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const staffName = localStorage.getItem('userName');
      const response = await axios.put(API_ENDPOINTS.ORDERS_STATUS, {
        orderId,
        status: newStatus,
        updatedBy: staffName
      });
      
      if (response.data.success) {
        toast.success(`Order moved to ${newStatus}`);
        fetchOrders(); // Refresh to show updated timeline
      }
    } catch (error) {
      toast.error('Failed to update order status');
    }
  };

  const getTimelineSteps = () => {
    return [
      { key: 'Pending', label: 'Ordered', icon: '📝' },
      { key: 'Confirmed', label: 'Confirmed', icon: '✅' },
      { key: 'Preparing', label: 'Preparing', icon: '🍳' },
      { key: 'Ready', label: 'Ready', icon: '🎉' },
      { key: 'Delivered', label: 'Delivered', icon: '🚚' }
    ];
  };

  const getStepStatus = (orderStatus, stepKey) => {
    const statusOrder = ['Pending', 'Confirmed', 'Preparing', 'Ready', 'Delivered'];
    const orderIndex = statusOrder.indexOf(orderStatus);
    const stepIndex = statusOrder.indexOf(stepKey);
    
    if (stepIndex < orderIndex) return 'completed';
    if (stepIndex === orderIndex) return 'current';
    return 'pending';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getNextAction = (status) => {
    const userRole = localStorage.getItem('userRole');
    const restrictedRoles = ['Manager', 'Supervisor', 'Cashier', 'Waiter'];
    const isRestrictedUser = restrictedRoles.includes(userRole);
    
    switch (status) {
      case 'Pending': 
        // Only chefs can confirm orders, not staff
        return isRestrictedUser ? null : { action: 'Confirm Order', nextStatus: 'Confirmed' };
      case 'Confirmed': 
        // Only chefs can start preparing, not staff
        return isRestrictedUser ? null : { action: 'Start Preparing', nextStatus: 'Preparing' };
      case 'Preparing': 
        // Only chefs can mark as ready, not staff
        return isRestrictedUser ? null : { action: 'Mark Ready', nextStatus: 'Ready' };
      case 'Ready': 
        // Both chefs and staff can mark as delivered
        return { action: 'Mark Delivered', nextStatus: 'Delivered' };
      default: return null;
    }
  };

  const filteredOrders = orders.filter(order => 
    order.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="chef-container">
        <StaffNavbar />
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading order timeline...</p>
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
            <div className="chef-avatar">🕒</div>
            <div className="chef-details">
              <h1 className="chef-title">Order Timeline</h1>
              <p className="chef-subtitle">Track order progress with visual timeline</p>
            </div>
          </div>
        </div>
      </header>

      <main className="chef-main">
        {/* Search Section */}
        <section className="section">
          <div className="search-container">
            <input
              type="text"
              placeholder="Search by Order ID or Customer Email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
        </section>

        {/* Orders Timeline */}
        <section className="section">
          <h2 className="section-title">
            Active Orders ({filteredOrders.length})
          </h2>
          
          {filteredOrders.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🎉</div>
              <h3>All orders completed!</h3>
              <p>No active orders to track at the moment.</p>
            </div>
          ) : (
            <div className="timeline-container">
              {filteredOrders.map((order) => {
                const nextAction = getNextAction(order.status);
                const timelineSteps = getTimelineSteps();
                
                return (
                  <div key={order.orderId} className="timeline-order">
                    {/* Order Header */}
                    <div className="timeline-order-header">
                      <div className="order-info">
                        <h3 className="order-id">#{order.orderId}</h3>
                        <div className="order-meta">
                          <span className="customer-info">👤 {order.email}</span>
                          <span className="order-time">🕒 {formatDate(order.orderDate)}</span>
                          <span className="order-total">💰 ₹{order.totalPrice}</span>
                        </div>
                      </div>
                      
                      {/* Action Button */}
                      {nextAction && (
                        <button
                          className="timeline-action-btn"
                          onClick={() => updateOrderStatus(order.orderId, nextAction.nextStatus)}
                        >
                          {nextAction.action}
                        </button>
                      )}
                    </div>

                    {/* Timeline Visualization */}
                    <div className="timeline-steps">
                      {timelineSteps.map((step, index) => {
                        const stepStatus = getStepStatus(order.status, step.key);
                        const isLast = index === timelineSteps.length - 1;
                        
                        return (
                          <div key={step.key} className="timeline-step">
                            <div className="timeline-step-content">
                              {/* Timeline Circle */}
                              <div className={`timeline-circle ${stepStatus}`}>
                                {stepStatus === 'completed' ? (
                                  <span className="check-icon">✓</span>
                                ) : (
                                  <span className="step-icon">{step.icon}</span>
                                )}
                              </div>
                              
                              {/* Timeline Line */}
                              {!isLast && (
                                <div className={`timeline-line ${stepStatus === 'completed' ? 'completed' : ''}`}></div>
                              )}
                            </div>
                            
                            {/* Step Label */}
                            <div className="timeline-label">
                              <span className={`step-label ${stepStatus}`}>
                                {step.label}
                              </span>
                              {stepStatus === 'current' && (
                                <span className="current-indicator">Current</span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Order Items Summary */}
                    <div className="timeline-order-items">
                      <h4>Order Items:</h4>
                      <div className="items-list">
                        {order.items.slice(0, 3).map((item, index) => (
                          <span key={index} className="item-tag">
                            {item.title} x{item.quantity}
                          </span>
                        ))}
                        {order.items.length > 3 && (
                          <span className="more-items-tag">
                            +{order.items.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default TrackOrders;
