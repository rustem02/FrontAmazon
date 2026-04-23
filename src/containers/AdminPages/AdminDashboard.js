import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../../components/Navbar';
import AuthContext from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';

export default function AdminDashboard() {
  const { authTokens } = useContext(AuthContext);
  const { t } = useTranslation();
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadMetrics = async () => {
      try {
        const response = await axios.get('admin/dashboard/', {
          headers: {
            Authorization: `Bearer ${authTokens.access}`,
          },
        });
        setMetrics(response.data);
      } catch (err) {
        setError('Failed to load admin analytics.');
      } finally {
        setLoading(false);
      }
    };

    loadMetrics();
  }, [authTokens]);

  return (
    <div className='rooms'>
      <Navbar />
      <div className='rooms-container'>
        <section className='dorm-information'>
          <header className='dorm-information-header'>
            <div className='title-main'>
              <h1>{t('admin.analyticsTitle')}</h1>
              <p>{t('admin.analyticsDesc')}</p>
            </div>
          </header>
        </section>

        {loading && <p>Loading analytics...</p>}
        {error && <p>{error}</p>}

        {metrics && (
          <section className='numeric-data-dorm'>
            <div className='data-dorm-item'>
              <h4>Users</h4>
              <h1>{metrics.users_total}</h1>
              <p>Total registered users.</p>
            </div>
            <div className='data-dorm-item'>
              <h4>Documents Verified</h4>
              <h1>{metrics.documents_verified}</h1>
              <p>Verified submissions.</p>
            </div>
            <div className='data-dorm-item'>
              <h4>Active Bookings</h4>
              <h1>{metrics.bookings_active}</h1>
              <p>Currently active room bookings.</p>
            </div>
            <div className='data-dorm-item'>
              <h4>Paid / Pending</h4>
              <h1>{metrics.payments_paid}/{metrics.payments_pending}</h1>
              <p>Payments processed vs pending.</p>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
