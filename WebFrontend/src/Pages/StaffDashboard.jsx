import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { API_ENDPOINTS } from '../config/api';
import StaffNavbar from '../components/StaffNavbar';
import './ChefStyles.css';

const StaffDashboard = () => {
  const navigate = useNavigate();
  const [staffInfo, setStaffInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    checkStaffAuth();
    fetchUserDetails();
    
    // Update time every minute
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timeInterval);
  }, [navigate]);

  const checkStaffAuth = () => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const userRole = localStorage.getItem('userRole');
    
    // Check if user is staff (Manager, Supervisor, Cashier, Waiter) but not Employee (Chef)
    const staffRoles = ['Manager', 'Supervisor', 'Cashier', 'Waiter'];
    
    if (!isLoggedIn || !staffRoles.includes(userRole)) {
      toast.error('Access denied. Staff login required.');
      navigate('/login');
      return;
    }
  };

  const fetchUserDetails = async () => {
    try {
      const userId = localStorage.getItem('userId');
      const response = await axios.get(`${API_ENDPOINTS.USER_PROFILE}/${userId}`);
      
      if (response.data.success) {
        setStaffInfo(response.data.user);
      } else {
        // Fallback to localStorage data
        setStaffInfo({
          name: localStorage.getItem('userName'),
          email: localStorage.getItem('userEmail'),
          role: localStorage.getItem('userRole'),
          position: localStorage.getItem('userRole'),
          specialization: 'General Staff'
        });
      }
    } catch (error) {
      console.error('Error fetching user details:', error);
      // Fallback to localStorage data
      setStaffInfo({
        name: localStorage.getItem('userName'),
        email: localStorage.getItem('userEmail'),
        role: localStorage.getItem('userRole'),
        position: localStorage.getItem('userRole'),
        specialization: 'General Staff'
      });
    } finally {
      setLoading(false);
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'Manager': return '👨‍💼';
      case 'Supervisor': return '👩‍💼';
      case 'Cashier': return '💰';
      default: return '👤';
    }
  };

  const getRoleDescription = (role) => {
    switch (role) {
      case 'Manager': return 'Restaurant Operations Manager';
      case 'Supervisor': return 'Floor Supervisor';
      case 'Cashier': return 'Cashier & Payment Processing';
      default: return 'Staff Member';
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    toast.success('Logged out successfully!');
    navigate('/login');
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="chef-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading staff dashboard...</p>
        </div>
      </div>
    );
  }

  if (!staffInfo) {
    return (
      <div className="chef-container">
        <div className="error-message">
          <p>Unable to load staff information. Please try logging in again.</p>
          <button onClick={() => navigate('/login')} className="btn btn-primary">
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="chef-container">
      {/* Staff Navigation */}
      <StaffNavbar />
      
      {/* Header */}
      <header className="chef-header">
        <div className="chef-header-content">
          <div className="chef-info">
            <div className="chef-avatar">
              {getRoleIcon(staffInfo.role)}
            </div>
            <div className="chef-details">
              <h1 className="chef-title">Staff Dashboard</h1>
              <p className="chef-subtitle">Welcome back, {staffInfo.name}!</p>
            </div>
          </div>
          <div className="chef-actions">
            <div className="btn btn-secondary" style={{ cursor: 'default', opacity: 0.7 }}>
              Logout
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="chef-main">
        {/* Staff Information Card */}
        <section className="section">
          <h2 className="section-title">Staff Information</h2>
          <div className="staff-info-grid">
            <div className="info-card">
              <div className="info-card-header">
                <div className="info-icon">{getRoleIcon(staffInfo.role)}</div>
                <h3>Personal Details</h3>
              </div>
              <div className="info-card-content">
                <div className="info-item">
                  <span className="info-label">👤 Full Name:</span>
                  <span className="info-value">{staffInfo.name}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">📧 Email:</span>
                  <span className="info-value">{staffInfo.email}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">💼 Position:</span>
                  <span className="info-value">{staffInfo.position || staffInfo.role}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">🎯 Role:</span>
                  <span className="info-value">{getRoleDescription(staffInfo.role)}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">⭐ Specialization:</span>
                  <span className="info-value">{staffInfo.specialization || 'General Operations'}</span>
                </div>
              </div>
            </div>

            {/* Current Status Card */}
            <div className="info-card">
              <div className="info-card-header">
                <div className="info-icon">⏰</div>
                <h3>Current Status</h3>
              </div>
              <div className="info-card-content">
                <div className="info-item">
                  <span className="info-label">📅 Today's Date:</span>
                  <span className="info-value">{formatDate(currentTime)}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">🕐 Current Time:</span>
                  <span className="info-value">{formatTime(currentTime)}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">✅ Status:</span>
                  <span className="status-badge status-active">On Duty</span>
                </div>
                <div className="info-item">
                  <span className="info-label">🏢 Department:</span>
                  <span className="info-value">Restaurant Operations</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Actions */}
        <section className="section">
          <h2 className="section-title">Quick Actions</h2>
          <div className="actions-grid">
            <div 
              className="action-card"
              style={{ cursor: 'default', opacity: 0.7 }}
            >
              <div className="action-icon">📋</div>
              <h3>View All Orders</h3>
              <p>Monitor and manage customer orders</p>
            </div>
            
            <div 
              className="action-card"
              style={{ cursor: 'default', opacity: 0.7 }}
            >
              <div className="action-icon">🍽️</div>
              <h3>Reservations</h3>
              <p>Manage table bookings and reservations</p>
            </div>
            
            <div 
              className="action-card"
              style={{ cursor: 'default', opacity: 0.7 }}
            >
              <div className="action-icon">📊</div>
              <h3>Reports</h3>
              <p>View sales and performance reports</p>
            </div>
            
            <div 
              className="action-card"
              style={{ cursor: 'default', opacity: 0.7 }}
            >
              <div className="action-icon">👥</div>
              <h3>Customer Management</h3>
              <p>Manage customer information and feedback</p>
            </div>
          </div>
        </section>

        {/* Role-Specific Features */}
        <section className="section">
          <h2 className="section-title">Role-Specific Features</h2>
          <div className="features-card">
            <div className="features-header">
              <div className="features-icon">{getRoleIcon(staffInfo.role)}</div>
              <h3>{staffInfo.role} Dashboard</h3>
            </div>
            <div className="features-content">
              {staffInfo.role === 'Manager' && (
                <div className="feature-list">
                  <div className="feature-item">📈 Sales Analytics & Reports</div>
                  <div className="feature-item">👥 Staff Management</div>
                  <div className="feature-item">🍽️ Menu Management</div>
                  <div className="feature-item">💰 Financial Overview</div>
                </div>
              )}
              {staffInfo.role === 'Supervisor' && (
                <div className="feature-list">
                  <div className="feature-item">👀 Floor Monitoring</div>
                  <div className="feature-item">📋 Order Oversight</div>
                  <div className="feature-item">🎯 Quality Control</div>
                  <div className="feature-item">👨‍🍳 Staff Coordination</div>
                </div>
              )}
              {staffInfo.role === 'Cashier' && (
                <div className="feature-list">
                  <div className="feature-item">💳 Payment Processing</div>
                  <div className="feature-item">🧾 Receipt Management</div>
                  <div className="feature-item">💰 Cash Register</div>
                  <div className="feature-item">📊 Daily Sales Summary</div>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default StaffDashboard;