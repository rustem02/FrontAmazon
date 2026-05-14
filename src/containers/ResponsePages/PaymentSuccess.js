import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../../components/Navbar';
import AuthContext from '../../context/AuthContext';

export default function PaymentSuccess() {
  const { authTokens } = useContext(AuthContext);
  const navigate = useNavigate();
  const [message, setMessage] = useState('Payment was successful.');

  useEffect(() => {
    const loadStatus = async () => {
      try {
        const response = await axios.get('payment/success/', {
          headers: {
            Authorization: `Bearer ${authTokens.access}`,
          },
        });
        setMessage(response?.data?.message || 'Payment was successful.');
      } catch (error) {
        setMessage('Payment was successful.');
      }
    };
    loadStatus();
  }, [authTokens]);

  return (
    <div className='oops congrats-booking'>
      <Navbar />
      <div className='oops-container doc-submitted-container congrats-container'>
        <div className='congrats-img'>
          <img src={require('../../img/congrats.png')} alt='success' />
        </div>
        <div className='oops-content doc-submitted-content congrats-content'>
          <h1 className='oops-title doc-submitted-title'>Payment Success</h1>
          <p className='oops-message doc-submitted-message'>{message}</p>
        </div>
        <button className='oops-link doc-submitted-link' onClick={() => navigate('/my-booking')}>
          Go to My Bookings
        </button>
      </div>
    </div>
  );
}
