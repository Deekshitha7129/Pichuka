import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { API_ENDPOINTS } from '../config/api';
import StaffNavbar from '../components/StaffNavbar';
import { FaBoxOpen, FaCheckCircle, FaClock, FaMotorcycle, FaUser, FaUtensils, FaReceipt } from 'react-icons/fa';
import './StaffQueue.css';

const StaffQueue = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  // Removed stats tracking as we only show ready orders now

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
        // Filter to show only 'Ready' orders
        const readyOrders = allOrders.filter(order => order.status === 'Ready');
        setOrders(readyOrders);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const markAsDelivered = async (orderId) => {
    try {
      const staffName = localStorage.getItem('userName');
      const response = await axios.put(API_ENDPOINTS.ORDERS_STATUS, {
        orderId,
        status: 'Delivered',
        updatedBy: staffName
      });
      
      if (response.data.success) {
        toast.success('Order marked as delivered!');
        // Remove the delivered order from the list
        setOrders(prevOrders => prevOrders.filter(order => order.orderId !== orderId));
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error('Failed to update order status');
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Pending': return 'status-pending';
      case 'Confirmed': return 'status-confirmed';
      case 'Preparing': return 'status-preparing';
      case 'Ready': return 'status-ready';
      default: return 'status-pending';
    }
  };

  const getProgressPercentage = (status) => {
    switch (status) {
      case 'Pending': return 25;
      case 'Confirmed': return 50;
      case 'Preparing': return 75;
      case 'Ready': return 100;
      default: return 0;
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

  // Only show 'Mark as Delivered' button for ready orders
  const getNextAction = () => {
    return { action: 'Mark Delivered', color: 'btn-primary' };
  };

  if (loading) {
    return (
      <div className="chef-container">
        <StaffNavbar />
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading queue...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="staff-queue-container">
      <StaffNavbar />
      
      <div className="staff-queue-header">
        <div className="header-content">
          <div className="header-text">
            <h1><FaMotorcycle /> Delivery Queue</h1>
            <p>Manage orders ready for delivery</p>
          </div>
          <div className="order-count-badge">
            {orders.length} {orders.length === 1 ? 'Order' : 'Orders'} Ready
          </div>
        </div>
      </div>

      <div className="staff-queue-content">
        {orders.length === 0 ? (
          <div className="empty-queue">
            <div className="empty-icon">
              <FaBoxOpen size={48} />
            </div>
            <h3>No Orders Pending Delivery</h3>
            <p>All orders have been delivered. Check back later for new orders.</p>
          </div>
        ) : (
          <div className="orders-grid">
            {orders.map((order) => (
              <div key={order.orderId} className="delivery-card">
                <div className="card-header">
                  <div className="order-meta">
                    <span className="order-number">Order #{order.orderId}</span>
                    <span className="order-time">
                      <FaClock /> {formatDate(order.orderDate)}
                    </span>
                  </div>
                  <div className="status-badge ready">
                    <FaCheckCircle /> Ready for Delivery
                  </div>
                </div>

                <div className="customer-info">
                  <div className="info-row">
                    <span className="info-label"><FaUser /> Customer</span>
                    <span className="info-value">{order.email}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label"><FaReceipt /> Total</span>
                    <span className="info-value total-amount">₹{order.totalPrice}</span>
                  </div>
                </div>

                <div className="order-items">
                  <div className="items-header">
                    <FaUtensils /> Items ({order.items.length})
                  </div>
                  <div className="items-list">
                    {order.items.slice(0, 3).map((item, index) => (
                      <div key={index} className="item-row">
                        <span className="item-name">{item.title}</span>
                        <span className="item-quantity">x{item.quantity}</span>
                      </div>
                    ))}
                    {order.items.length > 3 && (
                      <div className="more-items">
                        +{order.items.length - 3} more items
                      </div>
                    )}
                  </div>
                </div>

                <div className="delivery-actions">
                  <button 
                    className="deliver-btn"
                    onClick={() => markAsDelivered(order.orderId)}
                  >
                    <FaMotorcycle /> Mark as Delivered
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StaffQueue;
