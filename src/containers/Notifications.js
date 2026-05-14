import React, { useContext, useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import axios from 'axios';
import AuthContext from '../context/AuthContext';

export default function Notifications() {
  const { authTokens } = useContext(AuthContext);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const loadNotifications = async () => {
      setLoading(true);
      setErrorMessage('');
      try {
        const response = await axios.get('notifications/', {
          headers: {
            Authorization: `Bearer ${authTokens.access}`,
          },
        });
        setNotifications(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        setErrorMessage('Failed to load notifications.');
      } finally {
        setLoading(false);
      }
    };

    loadNotifications();
  }, [authTokens]);

  return (
    <div className='rooms'>
      <Navbar />
      <div className='rooms-container'>
        <section className='dorm-information'>
          <header className='dorm-information-header'>
            <div className='title-main'>
              <h1>Notifications</h1>
              <p>Recent updates for your booking, documents, and payment status.</p>
            </div>
          </header>
        </section>

        <section
          style={{
            background: '#fff',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.08)',
          }}
        >
          {loading && <p>Loading notifications...</p>}
          {!loading && errorMessage && <p style={{ color: '#E94949' }}>{errorMessage}</p>}
          {!loading && !errorMessage && notifications.length === 0 && (
            <p>No notifications yet.</p>
          )}

          {!loading && notifications.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {notifications.map((item) => (
                <div
                  key={item.id}
                  style={{
                    border: '1px solid #e5e7eb',
                    borderRadius: '12px',
                    padding: '12px 14px',
                  }}
                >
                  <h3 style={{ marginBottom: '6px' }}>{item.title || 'Notification'}</h3>
                  <p style={{ marginBottom: '6px' }}>{item.body}</p>
                  <small style={{ color: '#6b7280' }}>
                    {item.created_at ? new Date(item.created_at).toLocaleString() : ''}
                  </small>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
