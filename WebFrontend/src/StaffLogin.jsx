import { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { API_ENDPOINTS } from './config/api.js';
import './StaffLogin.css';

const StaffLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showChefCredentials, setShowChefCredentials] = useState(false);
  const [showStaffCredentials, setShowStaffCredentials] = useState(false);
  const navigate = useNavigate();

  const handleStaffLogin = (e) => {
    e.preventDefault();
    console.log('Attempting staff login with:', { email, password });
    
    axios.post(API_ENDPOINTS.LOGIN, { email, password })
      .then(result => {
        console.log('Staff login response:', result.data);
        if (result.data.message === "Success" && result.data.user) {
          const user = result.data.user;
          
          // Check if user is an employee (staff member)
          if (user.role === 'Employee') {
            localStorage.setItem("isLoggedIn", "true");
            localStorage.setItem("userName", user.name);
            localStorage.setItem("userEmail", user.email);
            localStorage.setItem("userId", user._id);
            
            // Determine if this is a chef or other staff based on position
            const position = user.position || '';
            const chefPositions = ['Chef', 'Head Chef', 'Sous Chef', 'Kitchen Manager', 'Founder & Head Chef'];
            const staffPositions = ['Manager', 'Supervisor', 'Cashier', 'Waiter'];
            
            if (chefPositions.some(chefPos => position.includes(chefPos)) || position.toLowerCase().includes('chef')) {
              // This is a chef
              localStorage.setItem("userRole", "Employee"); // Store role as Employee for backend compatibility
              localStorage.setItem("userPosition", position); // Store actual position
              console.log('Redirecting chef to dashboard');
              navigate('/chef-dashboard');
            } else if (staffPositions.includes(position)) {
              // This is non-chef staff
              localStorage.setItem("userRole", position); // Store position as userRole for staff routes
              localStorage.setItem("userPosition", position);
              console.log('Redirecting staff to dashboard');
              navigate('/staff-dashboard');
            } else {
              // Default: if no specific position, treat as general employee
              localStorage.setItem("userRole", "Employee");
              localStorage.setItem("userPosition", position || "Employee");
              console.log('Redirecting general employee to chef dashboard');
              navigate('/chef-dashboard');
            }
          } else {
            alert("Access denied. This account is not authorized for staff login.");
          }
        } else {
          alert("Login failed. Please check your credentials.");
        }
      })
      .catch(err => {
        console.error('Staff login error:', err);
        if (err.response?.status === 404) {
          alert("Staff account not found. Please check your email.");
        } else if (err.response?.status === 400) {
          alert("Incorrect password. Please try again.");
        } else {
          alert("Staff login failed. Please check your credentials and try again.");
        }
      });
  };

  const fillCredentials = (role) => {
    switch(role) {
      case 'founder':
        setEmail('deekshitha.burugupalli@pichuka.com');
        setPassword('employee123');
        break;
      case 'chef-maria':
        setEmail('chef.maria@pichuka.com');
        setPassword('employee123');
        break;
      case 'chef-raj':
        setEmail('chef.raj@pichuka.com');
        setPassword('employee123');
        break;
      case 'chef-lucas':
        setEmail('chef.lucas@pichuka.com');
        setPassword('employee123');
        break;
      case 'manager':
        setEmail('john.manager@pichuka.com');
        setPassword('staff123');
        break;
      case 'supervisor':
        setEmail('sarah.supervisor@pichuka.com');
        setPassword('staff123');
        break;
      case 'cashier':
        setEmail('lisa.cashier@pichuka.com');
        setPassword('staff123');
        break;
      case 'waiter1':
        setEmail('john.doe@pichuka.com');
        setPassword('waiter123');
        break;
      case 'waiter2':
        setEmail('jane.smith@pichuka.com');
        setPassword('waiter123');
        break;
      case 'waiter3':
        setEmail('michael.brown@pichuka.com');
        setPassword('waiter123');
        break;
      case 'waiter4':
        setEmail('emily.davis@pichuka.com');
        setPassword('waiter123');
        break;
      case 'waiter5':
        setEmail('david.wilson@pichuka.com');
        setPassword('waiter123');
        break;
      default:
        break;
    }
    
    // Auto-collapse sections after selection
    setShowChefCredentials(false);
    setShowStaffCredentials(false);
  };

  return (
    <div className='d-flex justify-content-center align-items-center bg-secondary vh-100'>
      <div className="bg-white p-4 rounded staff-login-container scrollable-container">
        <h2 className="text-center mb-4">Staff Login</h2>
        
        <form onSubmit={handleStaffLogin}>
          <div className="mb-3">
            <label htmlFor='email'><strong>Email</strong></label>
            <input
              type='email'
              placeholder='Enter Email'
              name='email'
              id='email'
              className='form-control rounded-0'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required />
          </div>
          <div className="mb-3">
            <label htmlFor='password'><strong>Password</strong></label>
            <input
              type='password'
              placeholder='Enter Password'
              name='password'
              id='password'
              className='form-control rounded-0'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required />
          </div>
          <button type='submit' className='btn btn-warning w-100 rounded-0 mb-4'>
            Staff Login
          </button>
        </form>

        {/* Sample Credentials Section */}
        <div className="sample-credentials">
          <h5 className="credentials-title">
            🧑‍🍳 Sample Credentials (For Demo Only)
          </h5>
          
          {/* Credential Type Buttons */}
          <div className="credential-type-buttons">
            <button 
              className={`credential-type-btn ${showChefCredentials ? 'active' : ''}`}
              onClick={() => {
                setShowChefCredentials(!showChefCredentials);
                setShowStaffCredentials(false);
              }}
            >
              👨‍🍳 Chef
              <span className="arrow">{showChefCredentials ? '▲' : '▼'}</span>
            </button>
            
            <button 
              className={`credential-type-btn ${showStaffCredentials ? 'active' : ''}`}
              onClick={() => {
                setShowStaffCredentials(!showStaffCredentials);
                setShowChefCredentials(false);
              }}
            >
              👩‍💼 Staff
              <span className="arrow">{showStaffCredentials ? '▲' : '▼'}</span>
            </button>
          </div>

          {/* Chef Credentials */}
          {showChefCredentials && (
            <div className="credentials-section slide-down">
              <div className="credentials-grid">
                <div className="credential-item" onClick={() => fillCredentials('founder')}>
                  <div className="credential-role">👑 Founder & Head Chef:</div>
                  <div className="credential-details">
                    <div>Email: deekshitha.burugupalli@pichuka.com</div>
                    <div>Password: employee123</div>
                  </div>
                </div>

                <div className="credential-item" onClick={() => fillCredentials('chef-maria')}>
                  <div className="credential-role">👩‍🍳 Chef Maria (Italian):</div>
                  <div className="credential-details">
                    <div>Email: chef.maria@pichuka.com</div>
                    <div>Password: employee123</div>
                  </div>
                </div>

                <div className="credential-item" onClick={() => fillCredentials('chef-raj')}>
                  <div className="credential-role">👨‍🍳 Chef Raj (Indian):</div>
                  <div className="credential-details">
                    <div>Email: chef.raj@pichuka.com</div>
                    <div>Password: employee123</div>
                  </div>
                </div>

                <div className="credential-item" onClick={() => fillCredentials('chef-lucas')}>
                  <div className="credential-role">👨‍🍳 Chef Lucas (Continental):</div>
                  <div className="credential-details">
                    <div>Email: chef.lucas@pichuka.com</div>
                    <div>Password: employee123</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Staff Credentials */}
          {showStaffCredentials && (
            <div className="credentials-section slide-down">
              <div className="credentials-grid">
                <div className="credential-item" onClick={() => fillCredentials('manager')}>
                  <div className="credential-role">👨‍💼 John Manager:</div>
                  <div className="credential-details">
                    <div>Name: John Manager</div>
                    <div>Role: Employee | Position: Manager</div>
                    <div>Email: john.manager@pichuka.com</div>
                    <div>Password: staff123</div>
                  </div>
                </div>

                <div className="credential-item" onClick={() => fillCredentials('supervisor')}>
                  <div className="credential-role">👩‍💼 Sarah Supervisor:</div>
                  <div className="credential-details">
                    <div>Name: Sarah Supervisor</div>
                    <div>Role: Employee | Position: Supervisor</div>
                    <div>Email: sarah.supervisor@pichuka.com</div>
                    <div>Password: staff123</div>
                  </div>
                </div>

                <div className="credential-item" onClick={() => fillCredentials('cashier')}>
                  <div className="credential-role">👩‍💼 Lisa Cashier:</div>
                  <div className="credential-details">
                    <div>Name: Lisa Cashier</div>
                    <div>Role: Employee | Position: Cashier</div>
                    <div>Email: lisa.cashier@pichuka.com</div>
                    <div>Password: staff123</div>
                  </div>
                </div>

                <div className="credential-item" onClick={() => fillCredentials('waiter1')}>
                  <div className="credential-role">👨‍🍽️ John Doe:</div>
                  <div className="credential-details">
                    <div>Name: John Doe</div>
                    <div>Role: Employee | Position: Waiter</div>
                    <div>Email: john.doe@pichuka.com</div>
                    <div>Password: waiter123</div>
                  </div>
                </div>

                <div className="credential-item" onClick={() => fillCredentials('waiter2')}>
                  <div className="credential-role">👩‍🍽️ Jane Smith:</div>
                  <div className="credential-details">
                    <div>Name: Jane Smith</div>
                    <div>Role: Employee | Position: Waiter</div>
                    <div>Email: jane.smith@pichuka.com</div>
                    <div>Password: waiter123</div>
                  </div>
                </div>

                <div className="credential-item" onClick={() => fillCredentials('waiter3')}>
                  <div className="credential-role">👨‍🍽️ Michael Brown:</div>
                  <div className="credential-details">
                    <div>Name: Michael Brown</div>
                    <div>Role: Employee | Position: Waiter</div>
                    <div>Email: michael.brown@pichuka.com</div>
                    <div>Password: waiter123</div>
                  </div>
                </div>

                <div className="credential-item" onClick={() => fillCredentials('waiter4')}>
                  <div className="credential-role">👩‍🍽️ Emily Davis:</div>
                  <div className="credential-details">
                    <div>Name: Emily Davis</div>
                    <div>Role: Employee | Position: Waiter</div>
                    <div>Email: emily.davis@pichuka.com</div>
                    <div>Password: waiter123</div>
                  </div>
                </div>

                <div className="credential-item" onClick={() => fillCredentials('waiter5')}>
                  <div className="credential-role">👨‍🍽️ David Wilson:</div>
                  <div className="credential-details">
                    <div>Name: David Wilson</div>
                    <div>Role: Employee | Position: Waiter</div>
                    <div>Email: david.wilson@pichuka.com</div>
                    <div>Password: waiter123</div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div className="credentials-note">
            💡 Click on any credential above to auto-fill the form
          </div>
        </div>

        <div className="text-center mt-4">
          <Link to="/login" className='btn btn-light rounded-0 text-decoration-none'>
            ← Back to Main Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default StaffLogin;
