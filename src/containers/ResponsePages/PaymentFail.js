import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../../components/Navbar';
import AuthContext from '../../context/AuthContext';

export default function PaymentFail() {
  const { authTokens } = useContext(AuthContext);
  const navigate = useNavigate();
  const [message, setMessage] = useState('Payment failed.');

  useEffect(() => {
    const loadStatus = async () => {
      try {
        const response = await axios.get('payment/fail/', {
          headers: {
            Authorization: `Bearer ${authTokens.access}`,
          },
        });
        setMessage(response?.data?.message || 'Payment failed.');
      } catch (error) {
        setMessage('Payment failed. Please try again.');
      }
    };
    loadStatus();
  }, [authTokens]);

  return (
    <div className='oops'>
      <Navbar />
      <div className='oops-container'>
        <div className='oops-img'>
          <img src={require('../../img/oops.png')} alt='payment-fail' />
        </div>
        <div className='oops-content'>
          <h1 className='oops-title'>Payment Failed</h1>
          <p className='oops-message'>{message}</p>
        </div>
        <button className='oops-link' onClick={() => navigate('/payment-booking')}>
          Retry payment
        </button>
      </div>
    </div>
  );
}
