import React, { useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isTokenMode = useMemo(() => Boolean(token), [token]);

  const requestResetLink = async (event) => {
    event.preventDefault();
    setError('');
    setSuccessMessage('');
    setIsSubmitting(true);

    try {
      await axios.post('password-reset-request/', { email });
      setSuccessMessage('Password reset link was sent to your email.');
    } catch (requestError) {
      const apiMessage =
        requestError?.response?.data?.email?.[0] ||
        requestError?.response?.data?.detail ||
        'Failed to send reset link. Please try again.';
      setError(apiMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const submitNewPassword = async (event) => {
    event.preventDefault();
    setError('');
    setSuccessMessage('');

    if (!password || !confirmPassword) {
      setError('Please fill in both password fields.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsSubmitting(true);
    try {
      await axios.post(`password-reset/${token}/`, {
        token,
        password,
      });
      setSuccessMessage('Password updated successfully. You can now sign in.');
      setTimeout(() => navigate('/'), 1200);
    } catch (requestError) {
      const apiMessage =
        requestError?.response?.data?.password?.[0] ||
        requestError?.response?.data?.token?.[0] ||
        requestError?.response?.data?.detail ||
        'Failed to update password. The reset link may be invalid or expired.';
      setError(apiMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main>
      <div className='signing'>
        <div className='container'>
          <div className='logo'>
            <img src={require('../img/logoDorm.png')} alt='logo' />
          </div>

          {!isTokenMode ? (
            <div className='form-content'>
              <div className='title-content'>
                <h2>Reset password</h2>
                <p>Enter your email and we will send you a reset link.</p>
              </div>
              <form onSubmit={requestResetLink}>
                <div className='field-component'>
                  <label htmlFor='email'>Email</label>
                  <input
                    type='email'
                    id='email'
                    name='email'
                    required
                    placeholder='Enter your email'
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                  />
                </div>
                {error && <p className='errorLogin'>{error}</p>}
                {successMessage && <p style={{ color: '#00A35D' }}>{successMessage}</p>}
                <button className='btn' disabled={isSubmitting}>
                  {isSubmitting ? 'Sending...' : 'Send reset link'}
                </button>
              </form>
            </div>
          ) : (
            <div className='form-content'>
              <div className='title-content'>
                <h2>Create new password</h2>
                <p>Enter and confirm your new password.</p>
              </div>
              <form onSubmit={submitNewPassword}>
                <div className='field-component'>
                  <label htmlFor='password'>New password</label>
                  <input
                    type='password'
                    id='password'
                    required
                    placeholder='Enter new password'
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                  />
                </div>
                <div className='field-component'>
                  <label htmlFor='confirm-password'>Confirm password</label>
                  <input
                    type='password'
                    id='confirm-password'
                    required
                    placeholder='Confirm new password'
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                  />
                </div>
                {error && <p className='errorLogin'>{error}</p>}
                {successMessage && <p style={{ color: '#00A35D' }}>{successMessage}</p>}
                <button className='btn' disabled={isSubmitting}>
                  {isSubmitting ? 'Saving...' : 'Save password'}
                </button>
              </form>
            </div>
          )}

          <h4>
            Back to sign in? <Link to='/'>Open login</Link>
          </h4>
        </div>
      </div>
    </main>
  );
}
