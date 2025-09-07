import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { API_ENDPOINTS } from '../config/api';
import StaffNavbar from '../components/StaffNavbar';
import './ChefStyles.css';

const StaffTrackOrders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkStaffAuth();
    fetchOrders();
    
    // Set up auto-refresh every 15 seconds for real-time updates
    const interval = setInterval(fetchOrders, 15000);
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
        // Show all orders for staff (no filtering like customer version)
        setOrders(response.data.orders || []);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  // Customer-style progress tracking functions
  const steps = ['Pending', 'Confirmed', 'Preparing', 'Ready', 'Delivered'];

  const getStatusStepIndex = (status) => {
    return steps.indexOf(status);
  };

  const getStatusColor = (index, currentStep) => {
    if (index < currentStep) return '#28a745'; // green
    if (index === currentStep) return '#007bff'; // blue
    return '#6c757d'; // gray
  };

  const markAsDelivered = async (orderId) => {
    try {
      const userEmail = localStorage.getItem('userEmail');
      const userRole = localStorage.getItem('userRole');
      const userName = localStorage.getItem('userName');
      
      const response = await axios.put(API_ENDPOINTS.ORDERS_MARK_DELIVERED, {
        orderId,
        userEmail,
        userRole: 'Employee',
        userPosition: userRole
      });
      
      if (response.data.success) {
        toast.success(`Order marked as delivered by ${userName}!`);
        fetchOrders(); // Refresh the orders list
      } else {
        toast.error(response.data.message || 'Failed to mark order as delivered');
      }
    } catch (error) {
      console.error('Delivery error:', error);
      if (error.response?.status === 403) {
        toast.error('Access denied. Only staff members can mark orders as delivered.');
      } else {
        toast.error('Failed to mark order as delivered');
      }
    }
  };

  return (
    <div>
      <StaffNavbar />
      <div className='order-tracking-container' style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
        <header className='order-tracking-header' style={{ marginBottom: '30px' }}>
          <h1 style={{ 
            textAlign: 'center', 
            marginBottom: '25px',
            fontSize: '2.5rem',
            fontWeight: '700',
            color: '#2c3e50',
            textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
          }}>📋 Staff Order Tracking System</h1>
          <p style={{
            textAlign: 'center',
            fontSize: '1.1rem',
            color: '#7f8c8d',
            marginBottom: '20px'
          }}>Monitor all customer orders with real-time progress tracking</p>
          <div style={{
            textAlign: 'center',
            padding: '15px',
            background: 'rgba(52, 152, 219, 0.1)',
            borderRadius: '10px',
            border: '1px solid rgba(52, 152, 219, 0.2)'
          }}>
            <span style={{ fontWeight: '600', color: '#2c3e50' }}>👥 Staff View: </span>
            <span style={{ color: '#7f8c8d' }}>Viewing all orders • Auto-refresh every 15 seconds</span>
          </div>
        </header>

        <main>
          {loading && <p style={{ textAlign: 'center', fontSize: '1.2rem', color: '#7f8c8d' }}>Loading orders...</p>}
          {!loading && orders.length === 0 && (
            <div style={{ 
              textAlign: 'center', 
              padding: '60px 20px',
              background: 'rgba(255, 255, 255, 0.95)',
              borderRadius: '15px',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
            }}>
              <div style={{ fontSize: '4rem', marginBottom: '20px' }}>📋</div>
              <h3 style={{ color: '#2c3e50', marginBottom: '10px' }}>No orders available</h3>
              <p style={{ color: '#7f8c8d' }}>There are currently no orders to track.</p>
            </div>
          )}
          {!loading && orders.map(order => {
            const currentStep = getStatusStepIndex(order.status);
            const userRole = localStorage.getItem('userRole');
            const restrictedRoles = ['Manager', 'Supervisor', 'Cashier', 'Waiter'];
            const isRestrictedUser = restrictedRoles.includes(userRole);
            
            return (
              <div key={order.orderId} style={{ 
                border: '1px solid #ddd', 
                borderRadius: '15px', 
                padding: '25px', 
                marginBottom: '30px', 
                boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)'
              }}>
                {/* Order Header Info */}
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', fontSize: '16px', flexWrap: 'wrap', gap: '15px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontWeight: 'bold', color: '#28a745' }}>Order ID: </span>
                    <span style={{ fontWeight: 'bold', color: '#28a745', fontSize: '1.1rem' }}>#{order.orderId.split('-')[1] || order.orderId}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontWeight: 'bold', color: '#2c3e50' }}>👤 Customer: </span>
                    <span style={{ color: '#7f8c8d' }}>{order.email}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontWeight: 'bold', color: '#e74c3c' }}>💰 Total: </span>
                    <span style={{ fontWeight: 'bold', color: '#e74c3c', fontSize: '1.1rem' }}>₹{order.totalPrice}</span>
                  </div>
                </div>

                {/* Order Date and Items Info */}
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '25px', fontSize: '14px', flexWrap: 'wrap', gap: '15px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontWeight: 'bold', color: '#7f8c8d' }}>📅 Order Date: </span>
                    <span>{new Date(order.orderDate).toLocaleString('en-IN', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontWeight: 'bold', color: '#7f8c8d' }}>🍽️ Items: </span>
                    <span>{order.items.length} item{order.items.length > 1 ? 's' : ''}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontWeight: 'bold', color: '#7f8c8d' }}>🕒 Status: </span>
                    <span style={{ 
                      padding: '4px 12px',
                      borderRadius: '15px',
                      fontSize: '12px',
                      fontWeight: '600',
                      backgroundColor: getStatusColor(currentStep, currentStep),
                      color: 'white'
                    }}>{order.status}</span>
                  </div>
                </div>

                {/* Customer-Style Progress Bar */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                  {steps.map((label, index) => (
                    <div key={index} style={{ textAlign: 'center', flex: 1, position: 'relative' }}>
                      <div style={{
                        width: '35px',
                        height: '35px',
                        margin: '0 auto 10px',
                        borderRadius: '50%',
                        backgroundColor: getStatusColor(index, currentStep),
                        color: 'white',
                        lineHeight: '35px',
                        fontWeight: 'bold',
                        fontSize: '16px',
                        zIndex: 1,
                        position: 'relative',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                      }}>
                        {index < currentStep ? '✔' : index === currentStep ? '➔' : ''}
                      </div>
                      <div style={{ 
                        fontSize: '13px', 
                        fontWeight: '600',
                        color: index <= currentStep ? '#2c3e50' : '#7f8c8d'
                      }}>{label}</div>
                      {index < steps.length - 1 && (
                        <div style={{
                          position: 'absolute',
                          top: '17px',
                          right: '-50%',
                          width: '100%',
                          height: '4px',
                          backgroundColor: getStatusColor(index, currentStep),
                          zIndex: 0,
                          borderRadius: '2px'
                        }}></div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Staff Action Buttons */}
                {isRestrictedUser && order.status === 'Ready' && (
                  <div style={{ textAlign: 'center', marginTop: '20px' }}>
                    <button
                      onClick={() => markAsDelivered(order.orderId)}
                      style={{
                        background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
                        color: 'white',
                        border: 'none',
                        padding: '12px 30px',
                        borderRadius: '25px',
                        fontSize: '1rem',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        boxShadow: '0 4px 15px rgba(40, 167, 69, 0.3)'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.transform = 'translateY(-2px)';
                        e.target.style.boxShadow = '0 8px 25px rgba(40, 167, 69, 0.4)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.boxShadow = '0 4px 15px rgba(40, 167, 69, 0.3)';
                      }}
                    >
                      🚚 Mark as Delivered
                    </button>
                  </div>
                )}

                {/* View Only Message for Non-Ready Orders */}
                {isRestrictedUser && order.status !== 'Ready' && order.status !== 'Delivered' && order.status !== 'Cancelled' && (
                  <div style={{
                    textAlign: 'center',
                    padding: '15px',
                    background: 'rgba(255, 193, 7, 0.1)',
                    borderRadius: '10px',
                    border: '1px solid rgba(255, 193, 7, 0.3)',
                    marginTop: '15px'
                  }}>
                    <span style={{ color: '#856404', fontWeight: '600' }}>📋 View Only Mode</span>
                    <br />
                    <span style={{ color: '#856404', fontSize: '0.9rem' }}>Only chefs can update order preparation status. You can mark orders as delivered when they're ready.</span>
                  </div>
                )}
              </div>
            );
          })}
        </main>
      </div>
    </div>
  );
};

export default StaffTrackOrders;
