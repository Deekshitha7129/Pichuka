import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import './Orders.css';

const ChefOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, pending, preparing, ready
  const navigate = useNavigate();
  const chefName = localStorage.getItem('userName');
  const chefEmail = localStorage.getItem('userEmail');

  useEffect(() => {
    fetchChefOrders();
  }, []);

  const fetchChefOrders = async () => {
    try {
      // Fetch orders assigned to this chef
      const response = await axios.get('http://localhost:4000/api/v1/orders/all');
      if (response.data.success) {
        // Filter orders that are either pending, preparing, or ready
        const chefRelevantOrders = response.data.orders.filter(order => 
          ['Pending', 'Confirmed', 'Preparing', 'Ready'].includes(order.status)
        );
        setOrders(chefRelevantOrders);
      }
    } catch (error) {
      toast.error('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      const response = await axios.put('http://localhost:4000/api/v1/orders/status', {
        orderId,
        status: newStatus,
        updatedBy: chefName
      });

      if (response.data.success) {
        toast.success(`Order status updated to ${newStatus}`);
        fetchChefOrders(); // Refresh orders
      }
    } catch (error) {
      toast.error('Failed to update order status');
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

  const filteredOrders = orders.filter(order => {
    if (filter === 'all') return true;
    if (filter === 'pending') return order.status === 'Pending' || order.status === 'Confirmed';
    if (filter === 'preparing') return order.status === 'Preparing';
    if (filter === 'ready') return order.status === 'Ready';
    return true;
  });

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
    <div className="chef-dashboard">
      <header className="chef-header">
        <div className="chef-header-content">
          <h1>Kitchen Orders</h1>
          <div className="chef-info">
            <span>Chef: {chefName}</span>
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
        <button 
          className="nav-btn"
          onClick={() => navigate('/chef-dashboard')}
        >
          Dashboard
        </button>
        <button 
          className="nav-btn active"
          onClick={() => navigate('/chef/orders')}
        >
          Kitchen Orders
        </button>
      </nav>

      <main className="chef-main">
        <div className="chef-controls">
          <div className="filter-buttons">
            <button 
              className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              All Orders ({orders.length})
            </button>
            <button 
              className={`filter-btn ${filter === 'pending' ? 'active' : ''}`}
              onClick={() => setFilter('pending')}
            >
              Pending ({orders.filter(o => ['Pending', 'Confirmed'].includes(o.status)).length})
            </button>
            <button 
              className={`filter-btn ${filter === 'preparing' ? 'active' : ''}`}
              onClick={() => setFilter('preparing')}
            >
              Preparing ({orders.filter(o => o.status === 'Preparing').length})
            </button>
            <button 
              className={`filter-btn ${filter === 'ready' ? 'active' : ''}`}
              onClick={() => setFilter('ready')}
            >
              Ready ({orders.filter(o => o.status === 'Ready').length})
            </button>
          </div>
        </div>

        <div className="orders-grid">
          {filteredOrders.length === 0 ? (
            <div className="no-orders">
              <h3>No orders found</h3>
              <p>No orders match the current filter.</p>
            </div>
          ) : (
            filteredOrders.map((order) => (
              <div key={order._id} className="order-card chef-order-card">
                <div className="order-header">
                  <div className="order-info">
                    <h3>Order #{order.orderId}</h3>
                    <p className="order-date">{formatDate(order.orderDate)}</p>
                    <p className="customer-email">{order.email}</p>
                  </div>
                  <div className="status-section">
                    <div 
                      className="status-badge" 
                      style={{ backgroundColor: getStatusColor(order.status) }}
                    >
                      {order.status}
                    </div>
                    {order.estimatedDeliveryTime && (
                      <p className="delivery-estimate">
                        Est. Delivery: {formatDate(order.estimatedDeliveryTime)}
                      </p>
                    )}
                  </div>
                </div>

                <div className="order-items">
                  <h4>Order Items:</h4>
                  <div className="items-list">
                    {order.items.map((item, index) => (
                      <div key={index} className="order-item">
                        <span className="item-name">{item.title}</span>
                        <span className="item-quantity">x{item.quantity}</span>
                        <span className="item-price">₹{item.price}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="order-footer">
                  <div className="order-total">
                    <h3>Total: ₹{order.totalPrice}</h3>
                  </div>
                  
                  {canChefUpdate(order.status) && (
                    <div className="chef-actions">
                      {getNextStatus(order.status) && (
                        <button
                          className="status-update-btn"
                          onClick={() => handleStatusUpdate(order.orderId, getNextStatus(order.status))}
                        >
                          {getNextStatus(order.status) === 'Preparing' ? 'Start Preparing' : 'Mark Ready'}
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {order.notes && (
                  <div className="order-notes">
                    <strong>Notes:</strong> {order.notes}
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

export default ChefOrders;
