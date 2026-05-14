import React, { useContext, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import axios from 'axios';
import AuthContext from '../context/AuthContext';

export default function PaymentSimulator() {
  const { authTokens } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loadingStatus, setLoadingStatus] = useState('');
  const [message, setMessage] = useState('');

  const paymentId = useMemo(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('payment_id');
  }, []);

  const provider = useMemo(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('provider') || 'unknown';
  }, []);

  const simulateStatus = async (status) => {
    if (!paymentId) {
      setMessage('Payment id is missing.');
      return;
    }

    setLoadingStatus(status);
    setMessage('');
    try {
      await axios.post(
        'payment/simulate/',
        {
          payment_id: paymentId,
          status,
        },
        {
          headers: {
            Authorization: `Bearer ${authTokens.access}`,
          },
        }
      );

      if (status === 'paid') {
        navigate('/payment-success');
      } else {
        navigate('/payment-fail');
      }
    } catch (error) {
      setMessage(error?.response?.data?.detail || 'Failed to simulate payment status.');
    } finally {
      setLoadingStatus('');
    }
  };

  return (
    <div className='rooms'>
      <Navbar />
      <div className='rooms-container'>
        <section className='dorm-information'>
          <header className='dorm-information-header'>
            <div className='title-main'>
              <h1>Payment Simulator</h1>
              <p>Provider: {provider} | Payment ID: {paymentId || 'N/A'}</p>
            </div>
          </header>
        </section>

        <section style={{ background: '#fff', borderRadius: '16px', padding: '24px', boxShadow: '0 10px 25px rgba(0,0,0,0.08)' }}>
          <p>Choose the payment result to continue your booking flow.</p>
          <div style={{ display: 'flex', gap: '12px', marginTop: '14px', flexWrap: 'wrap' }}>
            <button onClick={() => simulateStatus('paid')} disabled={Boolean(loadingStatus)}>
              {loadingStatus === 'paid' ? 'Processing...' : 'Simulate success'}
            </button>
            <button onClick={() => simulateStatus('failed')} disabled={Boolean(loadingStatus)}>
              {loadingStatus === 'failed' ? 'Processing...' : 'Simulate fail'}
            </button>
          </div>
          {message && <p style={{ marginTop: '12px', color: '#E94949' }}>{message}</p>}
        </section>
      </div>
    </div>
  );
}
