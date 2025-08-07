import './App.css'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useEffect, useState } from 'react';
import Home from "./Pages/Home";
import NotFound from "./Pages/NotFound";
import Success from "./Pages/Success";
import SignUp from './SignUp'
import Login from './Login'
import StaffLogin from './StaffLogin'
import Orders from './Pages/Orders';
import Cart from './Pages/Cart';
import OrderHistory from './Pages/OrderHistory';
import CustomerOrderHistory from './Pages/CustomerOrderHistory';
import StaffDashboard from './Pages/StaffDashboard';
import OrderTracking from './Pages/OrderTracking';
import ChefDashboard from './Pages/ChefDashboard';
import ChefOrders from './Pages/ChefOrders';
import ChefKitchenQueue from './Pages/ChefKitchenQueue';
import StaffTrackOrders from './Pages/StaffTrackOrders';
import StaffQueue from './Pages/StaffQueue';
import StaffOrderHistory from './Pages/StaffOrderHistory';
import TrackOrders from './Pages/TrackOrders';
import Queue from './Pages/Queue';

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const [isChecking, setIsChecking] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    const checkAccess = () => {
      const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
      const userRole = localStorage.getItem("userRole");
      
      if (!isLoggedIn) {
        setHasAccess(false);
      } else if (allowedRoles && allowedRoles.length > 0) {
        setHasAccess(allowedRoles.includes(userRole));
      } else {
        setHasAccess(true);
      }
      
      setIsChecking(false);
    };

    checkAccess();
  }, [allowedRoles]);

  if (isChecking) {
    return <div className="loading">Checking access...</div>;
  }

  if (!hasAccess) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// Role-based route protection
const CustomerRoute = ({ children }) => {
  const userRole = localStorage.getItem("userRole");
  const staffRoles = ["Employee", "Manager", "Supervisor", "Cashier"];
  const isCustomer = !staffRoles.includes(userRole);
  
  if (!isCustomer) {
    // Redirect Employee users (chefs) to their dashboard
    if (userRole === "Employee") {
      return <Navigate to="/chef-dashboard" replace />;
    }
    // Redirect staff users to their dashboard
    if (["Manager", "Supervisor", "Cashier"].includes(userRole)) {
      return <Navigate to="/staff-dashboard" replace />;
    }
    // Fallback to unauthorized for other cases
    return <Navigate to="/unauthorized" replace />;
  }
  
  return children;
};

const ChefRoute = ({ children }) => {
  return (
    <ProtectedRoute allowedRoles={["Employee"]}>
      {children}
    </ProtectedRoute>
  );
};

const StaffRoute = ({ children }) => {
  return (
    <ProtectedRoute allowedRoles={["Manager", "Supervisor", "Cashier", "Waiter"]}>
      {children}
    </ProtectedRoute>
  );
};

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/success' element={<Success />} />
        <Route path='*' element={<NotFound />} />
        <Route path='/register' element={<SignUp />} />
        <Route path='/login' element={<Login />} />
        <Route path='/staff-login' element={<StaffLogin />} />
        <Route path='/unauthorized' element={<NotFound message="Access Denied" />} />
        
        {/* Customer Routes */}
        <Route path='/home' element={
          <CustomerRoute>
            <Home />
          </CustomerRoute>
        } />
        <Route path='/orders' element={
          <CustomerRoute>
            <Orders />
          </CustomerRoute>
        } />
        <Route path='/cart' element={
          <CustomerRoute>
            <Cart />
          </CustomerRoute>
        } />
        <Route path='/order-history' element={
          <CustomerRoute>
            <CustomerOrderHistory />
          </CustomerRoute>
        } />
        <Route path='/track-order' element={
          <CustomerRoute>
            <OrderTracking />
          </CustomerRoute>
        } />
        
        {/* Chef Routes */}
        <Route path='/chef-dashboard' element={
          <ChefRoute>
            <ChefDashboard />
          </ChefRoute>
        } />
        <Route path='/chef/orders' element={
          <ChefRoute>
            <ChefOrders />
          </ChefRoute>
        } />
        <Route path='/chef/kitchen-queue' element={
          <ChefRoute>
            <ChefKitchenQueue />
          </ChefRoute>
        } />
        
        {/* Staff Routes */}
        <Route path='/staff-dashboard' element={
          <StaffRoute>
            <StaffDashboard />
          </StaffRoute>
        } />
        <Route path='/staff/track-orders' element={
          <StaffRoute>
            <StaffTrackOrders />
          </StaffRoute>
        } />
        <Route path='/staff/queue' element={
          <StaffRoute>
            <StaffQueue />
          </StaffRoute>
        } />
        <Route path='/staff/order-history' element={
          <StaffRoute>
            <StaffOrderHistory />
          </StaffRoute>
        } />
        <Route path='/track-orders' element={
          <StaffRoute>
            <TrackOrders />
          </StaffRoute>
        } />
        <Route path='/queue' element={
          <StaffRoute>
            <Queue />
          </StaffRoute>
        } />
      </Routes>
      <Toaster />
    </Router>
  );
}

export default App;
