import { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { API_ENDPOINTS } from './config/api.js';

const Login = () => {
  const [showRoleSelect, setShowRoleSelect] = useState(true);
  const [role, setRole] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [staffId, setStaffId] = useState('');
  const [staffPassword, setStaffPassword] = useState('');
  const navigate = useNavigate();

  const handleRoleSelect = (selectedRole) => {
    if (selectedRole === 'staff') {
      // Redirect to separate staff login page
      navigate('/staff-login');
    } else {
      setRole(selectedRole);
      setShowRoleSelect(false);
    }
  };

  const handleCustomerLogin = (e) => {
    e.preventDefault();
    axios.post(API_ENDPOINTS.LOGIN, { email, password })
      .then(result => {
        if (result.data.message === "Success") {
          localStorage.setItem("isLoggedIn", true);
          localStorage.setItem("userName", result.data.user.name);
          localStorage.setItem("userEmail", result.data.user.email);
          
          // Store user ID and role
          localStorage.setItem("userId", result.data.user._id);
          localStorage.setItem("userRole", result.data.user.role || "Customer");
          
          // Check user role and redirect accordingly
          if (result.data.user.role === 'Employee') {
            // Chef role
            navigate('/chef-dashboard');
          } else if (['Manager', 'Supervisor', 'Cashier'].includes(result.data.user.role)) {
            // Staff roles
            navigate('/staff-dashboard');
          } else {
            // Customer role
            navigate('/home');
          }
        }
      })
      .catch(err => alert("Login failed. Please check your credentials."));
  };

  const handleStaffLogin = (e) => {
    e.preventDefault();
    console.log('Attempting staff login with:', { email: staffId, password: staffPassword });
    
    // Use the same endpoint, but send staffId as email
    axios.post(API_ENDPOINTS.LOGIN, { email: staffId, password: staffPassword })
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
            const chefPositions = ['Chef', 'Head Chef', 'Sous Chef', 'Kitchen Manager'];
            const staffPositions = ['Manager', 'Supervisor', 'Cashier', 'Waiter'];
            
            if (chefPositions.includes(position) || position.toLowerCase().includes('chef')) {
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
          alert("Staff account not found. Please check your Staff ID.");
        } else if (err.response?.status === 400) {
          alert("Incorrect password. Please try again.");
        } else {
          alert("Staff login failed. Please check your credentials and try again.");
        }
      });
  };

  return (
    <div className='d-flex justify-content-center align-items-center bg-secondary vh-100'>
      <div className="bg-white p-3 rounded w-25">
        <h2>Login</h2>
        {showRoleSelect ? (
          <div className="mb-3 text-center">
            <p>Login as:</p>
            <button className='btn btn-primary m-2' onClick={() => handleRoleSelect('customer')}>Customer</button>
            <button className='btn btn-warning m-2' onClick={() => handleRoleSelect('staff')}>Staff</button>
          </div>
        ) : role === 'customer' ? (
          <form onSubmit={handleCustomerLogin}>
            <div className="mb-3">
              <label htmlFor='email'><strong>Email</strong></label>
              <input
                type='email'
                placeholder='Enter Email'
                name='email'
                id='email'
                className='form-control rounded-0'
                onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="mb-3">
              <label htmlFor='password'><strong>Password</strong></label>
              <input
                type='password'
                placeholder='Enter Password'
                name='password'
                id='password'
                className='form-control rounded-0'
                onChange={(e) => setPassword(e.target.value)} />
            </div>
            <button type='submit' className='btn btn-success w-100 rounded-0'>Login</button>
          </form>
        ) : (
          <form onSubmit={handleStaffLogin}>
            <div className="mb-3">
              <label htmlFor='staffId'><strong>Staff ID</strong></label>
              <input
                type='text'
                placeholder='Enter Staff ID'
                name='staffId'
                id='staffId'
                className='form-control rounded-0'
                onChange={(e) => setStaffId(e.target.value)} />
            </div>
            <div className="mb-3">
              <label htmlFor='staffPassword'><strong>Password</strong></label>
              <input
                type='password'
                placeholder='Enter Staff Password'
                name='staffPassword'
                id='staffPassword'
                className='form-control rounded-0'
                onChange={(e) => setStaffPassword(e.target.value)} />
            </div>
            <button type='submit' className='btn btn-warning w-100 rounded-0'>Staff Login</button>
          </form>
        )}
        <p className="mt-3">Don't have an account?</p>
        <Link to="/register" className='btn btn-light w-100 rounded-0 text-decoration-none'>Register</Link>
      </div>
    </div>
  )
}

export default Login;
