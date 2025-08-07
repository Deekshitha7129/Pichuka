import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import './Success.css';

const Success = () => {
  const navigate = useNavigate();

  useEffect(() => {
    toast.success('Reservation successful at Pichuka!');
    const timer = setTimeout(() => {
      navigate('/');
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="success">
      <div className="success-container">
        <h1 className="success-title">Reservation Confirmed!</h1>
        <p className="success-message">
          Your table has been successfully reserved at Pichuka Restaurant. We look forward to serving you an amazing multi-cuisine experience!
        </p>
        <p className="success-subtitle">Thank you for choosing Pichuka</p>
      </div>
    </div>
  );
};

export default Success;
