import { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { API_ENDPOINTS } from './config/api.js';

const SignUp = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Customer');
  const [secretPin, setSecretPin] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Only send secretPin if role is Employee
    const payload = { name, email, password, role };
    if (role === 'Employee') {
      payload.secretPin = secretPin;
    }
    axios.post(API_ENDPOINTS.REGISTER, payload, {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then(result => {
      // Auto login user after successful registration
      // The registration response contains the created user data directly
      if (result.data) {
        // Set user data in localStorage
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("userName", result.data.name);
        localStorage.setItem("userEmail", result.data.email);
        toast.success("Registration successful! You are now logged in.");
        navigate('/'); // Redirect to home page
      } else {
        // Fallback if user data not returned properly
        toast.success("Registration successful!");
        navigate('/'); // Redirect to home page
      }
    })
    .catch(err => {
      if (err.response && err.response.data) {
        toast.error(err.response.data);
      } else {
        toast.error("An error occurred during registration.");
      }
    });
  };

  return (
    <div className='d-flex justify-content-center align-items-center bg-secondary vh-100'>
      <div className="bg-white p-3 rounded w-25">
        <h2>Register</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor='name'><strong>Name</strong></label>
            <input
              type='text'
              placeholder='Enter Name'
              autoComplete='off'
              name='name'
              id='name'
              className='form-control rounded-0'
              onChange={(e) => setName(e.target.value)} 
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor='email'><strong>Email</strong></label>
            <input
              type='email'
              placeholder='Enter Email'
              name='email'
              id='email'
              className='form-control rounded-0'
              autoComplete='off'
              onChange={(e) => setEmail(e.target.value)} 
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor='password'><strong>Password</strong></label>
            <input
              type='password'
              placeholder='Enter Password'
              name='password'
              id='password'
              className='form-control rounded-0'
              autoComplete='off'
              onChange={(e) => setPassword(e.target.value)} 
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor='role'><strong>Register as</strong></label>
            <select
              id='role'
              className='form-control rounded-0'
              value={role}
              onChange={e => setRole(e.target.value)}
            >
              <option value='Customer'>Customer</option>
              <option value='Employee'>Employee</option>
            </select>
          </div>
          {role === 'Employee' && (
            <div className="mb-3">
              <label htmlFor='secretPin'><strong>Secret Pin</strong></label>
              <input
                type='password'
                placeholder='Enter Secret Pin'
                name='secretPin'
                id='secretPin'
                className='form-control rounded-0'
                onChange={e => setSecretPin(e.target.value)}
                required={role === 'Employee'}
              />
            </div>
          )}
          <button type='submit' className='btn btn-success w-100 rounded-0'>
            Register
          </button>
        </form>
        <p className="mt-3">Already have an account?</p>
        <Link to="/login" className='btn btn-light w-100 rounded-0 text-decoration-none'>
          Login
        </Link>
      </div>
    </div>
  )
}

export default SignUp;

