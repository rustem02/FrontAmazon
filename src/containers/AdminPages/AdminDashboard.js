import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../../components/Navbar';
import AuthContext from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';

export default function AdminDashboard() {
  const { authTokens } = useContext(AuthContext);
  const { t } = useTranslation();
  const [metrics, setMetrics] = useState(null);
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadMetrics = async () => {
      try {
        const [metricsResponse, logsResponse] = await Promise.all([
          axios.get('admin/dashboard/', {
            headers: {
              Authorization: `Bearer ${authTokens.access}`,
            },
          }),
          axios.get('admin/audit-logs/', {
            headers: {
              Authorization: `Bearer ${authTokens.access}`,
            },
          }),
        ]);
        setMetrics(metricsResponse.data);
        setAuditLogs(Array.isArray(logsResponse.data) ? logsResponse.data.slice(0, 8) : []);
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
          <>
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

            <section style={{ marginTop: '24px', background: '#fff', borderRadius: '14px', padding: '16px' }}>
              <h3 style={{ marginBottom: '12px' }}>Recent audit events</h3>
              {auditLogs.length === 0 && <p>No audit logs yet.</p>}
              {auditLogs.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {auditLogs.map((log) => (
                    <div key={log.id} style={{ border: '1px solid #e5e7eb', borderRadius: '10px', padding: '10px 12px' }}>
                      <p>
                        <strong>{log.action}</strong> | {log.entity_type}:{log.entity_id || '-'}
                      </p>
                      <small style={{ color: '#6b7280' }}>
                        {log.user_email || 'system'} | {log.created_at ? new Date(log.created_at).toLocaleString() : ''}
                      </small>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </div>
  );
}
