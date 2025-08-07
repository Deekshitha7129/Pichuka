import { useState, useEffect } from 'react';
import './Orders.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const OrderTracking = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const userEmail = localStorage.getItem('userEmail');
    if (!userEmail) {
      toast.error('User not logged in');
      return;
    }
    setLoading(true);
    axios.get(`http://localhost:4000/api/v1/orders/history?email=${userEmail}`)
      .then(response => {
        if (response.data.success) {
          // Filter out delivered and cancelled orders from tracking page
          const filteredOrders = response.data.orders.filter(order => order.status !== 'Delivered' && order.status !== 'Cancelled');
          setOrders(filteredOrders);

          // Retrieve notified orders from sessionStorage
          const notifiedOrders = JSON.parse(sessionStorage.getItem('notifiedOrders') || '[]');

          // Check for delivered or cancelled orders to show popup only once
          response.data.orders.forEach(order => {
            if ((order.status === 'Delivered' || order.status === 'Cancelled') && !notifiedOrders.includes(order.orderId)) {
              if (order.status === 'Delivered') {
                toast.success(`Order ${order.orderId} has been delivered.`);
              } else if (order.status === 'Cancelled') {
                toast.error(`Order ${order.orderId} has been cancelled by staff.`);
              }
              notifiedOrders.push(order.orderId);
            }
          });

          // Update sessionStorage with notified orders
          sessionStorage.setItem('notifiedOrders', JSON.stringify(notifiedOrders));
        } else {
          toast.error('Failed to fetch orders');
        }
      })
      .catch(() => {
        toast.error('Error fetching orders');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const steps = ['Pending', 'Confirmed', 'Preparing', 'Ready', 'Delivered'];

  const getStatusStepIndex = (status) => {
    return steps.indexOf(status);
  };

  const getStatusColor = (index, currentStep) => {
    if (index < currentStep) return '#28a745'; // green
    if (index === currentStep) return '#007bff'; // blue
    return '#6c757d'; // gray
  };

  return (
    <div className='order-tracking-container' style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <header className='order-tracking-header' style={{ marginBottom: '30px' }}>
        <h1 style={{ 
          textAlign: 'center', 
          marginBottom: '25px',
          fontSize: '2.5rem',
          fontWeight: '700',
          color: '#2c3e50',
          textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
        }}>📋 Order Tracking System</h1>
        <nav style={{ display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap' }}>
          <button 
            onClick={() => navigate('/')} 
            style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '25px',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              minWidth: '120px',
              justifyContent: 'center'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 8px 25px rgba(102, 126, 234, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.3)';
            }}
          >
            🏠 Home
          </button>
          <button 
            onClick={() => navigate('/cart')} 
            style={{
              background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '25px',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 15px rgba(240, 147, 251, 0.3)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              minWidth: '120px',
              justifyContent: 'center'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 8px 25px rgba(240, 147, 251, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 4px 15px rgba(240, 147, 251, 0.3)';
            }}
          >
            🛒 Cart
          </button>
          <button 
            onClick={() => navigate('/orders')} 
            style={{
              background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '25px',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 15px rgba(79, 172, 254, 0.3)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              minWidth: '120px',
              justifyContent: 'center'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 8px 25px rgba(79, 172, 254, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 4px 15px rgba(79, 172, 254, 0.3)';
            }}
          >
            🍽️ Orders
          </button>
        </nav>
      </header>

      <main>
        {loading && <p style={{ textAlign: 'center' }}>Loading orders...</p>}
        {!loading && orders.length === 0 && <p style={{ textAlign: 'center' }}>No orders to track currently.</p>}
        {!loading && orders.map(order => {
          const currentStep = getStatusStepIndex(order.status);
          return (
            <div key={order.orderId} style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '20px', marginBottom: '30px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px', fontSize: '16px' }}>
                <div>
                  <span style={{ fontWeight: 'bold', color: '#28a745' }}>Order ID: </span>
                  <span style={{ fontWeight: 'bold', color: '#28a745' }}>{order.orderId}</span>
                </div>
                <div>
                  <span style={{ fontWeight: 'bold' }}>Expected Arrival: </span>
                  <span>{order.estimatedDeliveryTime ? new Date(order.estimatedDeliveryTime).toLocaleDateString() : 'N/A'}</span>
                </div>
                <div>
                  <span style={{ fontWeight: 'bold', color: '#dc3545' }}>Tracking ID: </span>
                  <span style={{ fontWeight: 'bold', color: '#dc3545' }}>{order.orderId}</span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                {steps.map((label, index) => (
                  <div key={index} style={{ textAlign: 'center', flex: 1, position: 'relative' }}>
                    <div style={{
                      width: '30px',
                      height: '30px',
                      margin: '0 auto 8px',
                      borderRadius: '50%',
                      backgroundColor: getStatusColor(index, currentStep),
                      color: 'white',
                      lineHeight: '30px',
                      fontWeight: 'bold',
                      fontSize: '18px',
                      zIndex: 1,
                      position: 'relative'
                    }}>
                      {index < currentStep ? '✔' : index === currentStep ? '➔' : ''}
                    </div>
                    <div style={{ fontSize: '12px', fontWeight: '600' }}>{label}</div>
                    {index < steps.length - 1 && (
                      <div style={{
                        position: 'absolute',
                        top: '15px',
                        right: '-50%',
                        width: '100%',
                        height: '4px',
                        backgroundColor: getStatusColor(index, currentStep),
                        zIndex: 0
                      }}></div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </main>
    </div>
  );
};

export default OrderTracking;
