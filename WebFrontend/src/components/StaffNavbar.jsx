import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import './StaffNavbar.css';

const StaffNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const staffName = localStorage.getItem('userName');
  const staffRole = localStorage.getItem('userRole');

  const handleLogout = () => {
    localStorage.clear();
    toast.success('Logged out successfully!');
    navigate('/login');
  };

  const handleNavigation = (path) => {
    navigate(path);
  };

  const isCurrentPage = (path) => {
    return location.pathname === path;
  };

  const showBackButton = location.pathname !== '/staff-dashboard';

  return (
    <nav className="staff-navbar">
      <div className="staff-navbar-container">
        {/* Left Section - Logo and Back Button */}
        <div className="staff-navbar-left">
          <div className="staff-navbar-logo">
            <span className="logo-icon">🏢</span>
            <span className="logo-text">Pichuka Staff</span>
          </div>
          
          {showBackButton && (
            <button 
              className="back-button"
              onClick={() => navigate('/staff-dashboard')}
            >
              ← Back to Dashboard
            </button>
          )}
        </div>

        {/* Center Section - Navigation Links */}
        <div className="staff-navbar-center">
          <button 
            className={`nav-link ${isCurrentPage('/staff-dashboard') ? 'active' : ''}`}
            onClick={() => handleNavigation('/staff-dashboard')}
          >
            🏠 Home
          </button>
          
          <button 
            className={`nav-link ${isCurrentPage('/staff/track-orders') ? 'active' : ''}`}
            onClick={() => handleNavigation('/staff/track-orders')}
          >
            📍 Track Orders
          </button>
          
          <button 
            className={`nav-link ${isCurrentPage('/staff/queue') ? 'active' : ''}`}
            onClick={() => handleNavigation('/staff/queue')}
          >
            📋 Queue
          </button>
          
          <button 
            className={`nav-link ${isCurrentPage('/staff/order-history') ? 'active' : ''}`}
            onClick={() => handleNavigation('/staff/order-history')}
          >
            📚 Order History
          </button>
        </div>

        {/* Right Section - User Info and Logout */}
        <div className="staff-navbar-right">
          <div className="staff-info">
            <span className="staff-name">{staffName}</span>
            <span className="staff-role">({staffRole})</span>
          </div>
          
          <button 
            className="logout-button"
            onClick={handleLogout}
          >
            🚪 Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default StaffNavbar;
