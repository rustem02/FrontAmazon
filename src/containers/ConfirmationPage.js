import React, { useContext, useMemo, useState } from 'react';
import Navbar from '../components/Navbar';
import { Link, useNavigate } from 'react-router-dom';
import Modal from 'react-modal';
import axios from 'axios';
import AuthContext from '../context/AuthContext';

export default function ConfirmationPage() {
  const navigate = useNavigate();
  const { authTokens } = useContext(AuthContext);

  const draft = useMemo(() => {
    const raw = localStorage.getItem('bookingDraft');
    return raw ? JSON.parse(raw) : null;
  }, []);

  const [isModalOpen, setModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const bookingAmount = Number(draft?.amount || 195000);

  const submitSeatPlace = async () => {
    if (!draft) {
      setSubmitError('Booking data is missing. Please select seat again.');
      return;
    }

    try {
      setIsSubmitting(true);
      setSubmitError('');
      const response = await axios.post(
        'bookings/',
        {
          block: draft.block,
          room_number: draft.room_number,
          seat_number: draft.seat_number,
          dormitory_id: draft.dormitory_id,
          semester_duration: draft.semester_duration,
        },
        {
          headers: {
            Authorization: `Bearer ${authTokens.access}`,
          },
        }
      );

      const bookingId = response?.data?.id;
      if (!bookingId) {
        setSubmitError('Booking created, but booking ID was not returned.');
        return;
      }

      localStorage.setItem('currentBookingId', String(bookingId));
      localStorage.setItem('currentBookingAmount', String(bookingAmount));
      navigate('/payment-booking');
    } catch (error) {
      const message =
        error?.response?.data?.error ||
        error?.response?.data?.non_field_errors?.[0] ||
        'Failed to create booking. Seat may have been already reserved.';
      setSubmitError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!draft) {
    return (
      <main className='confirmation-data'>
        <Navbar />
        <div className='background-of-confirmation'>
          <div className='confirmation-content'>
            <div className='confirmation-info-left'>
              <h2>Booking draft not found</h2>
              <p>Please return to booking page and select a seat first.</p>
              <Link to="/booking">Back to booking</Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className='confirmation-data'>
      <Navbar />
      <div className='background-of-confirmation'>
        <div className='confirmation-content'>
          <div className='confirmation-info-left'>
            <img src={require('../img/logoDorm.png')} alt="logo" />
            <div className='txt-details'>
              <h2>Confirmation</h2>
              <p>Double-check your selected place before creating booking.</p>
            </div>
            <div className='me-selected'>
              <h3 className='me-selected-text'>You Selected:</h3>
              <div>
                <h3>Block: {draft.block}</h3>
                <h3>Room: {draft.room_number}</h3>
                <h3>Seat: {draft.seat_number}</h3>
                <h3>Semester duration: {draft.semester_duration}</h3>
                {draft.dormitory_name && <h3>Dormitory: {draft.dormitory_name}</h3>}
              </div>
            </div>
            {(draft.image_url || draft.room_image_url) && (
              <div style={{ display: 'flex', gap: '10px', marginTop: '12px', flexWrap: 'wrap' }}>
                {draft.image_url && (
                  <img
                    src={draft.image_url}
                    alt="Dormitory exterior"
                    style={{ width: '150px', height: '95px', objectFit: 'cover', borderRadius: '8px' }}
                  />
                )}
                {draft.room_image_url && (
                  <img
                    src={draft.room_image_url}
                    alt="Dormitory room"
                    style={{ width: '150px', height: '95px', objectFit: 'cover', borderRadius: '8px' }}
                  />
                )}
              </div>
            )}
          </div>
          <div className='confirmation-info-right'>
            <div>
              <p>Kazakhstan Universities Dormitory Network</p>
              <h3>Online booking confirmation</h3>
            </div>
            <h3>Total cost: {bookingAmount.toLocaleString('ru-RU')} ₸</h3>
          </div>
        </div>
        <div className='btns-confirmation'>
          <button onClick={() => setModalOpen(true)}>Cancel booking</button>
          <Modal className='modal' isOpen={isModalOpen} onRequestClose={() => setModalOpen(false)}>
            <h3>Do you really cancel the reservation?</h3>
            <div className='btns-modal btns-modal-cancel'>
              <button onClick={() => setModalOpen(false)}>No, return</button>
              <Link to='/booking'>
                <button className='btn-cancel' onClick={() => setModalOpen(false)}>
                  Yes, cancel
                </button>
              </Link>
            </div>
          </Modal>
          <Link to="/booking">
            <button>Previous step</button>
          </Link>
          <button className='btn-to-payment' onClick={submitSeatPlace} disabled={isSubmitting}>
            {isSubmitting ? 'Creating booking...' : `Pay: ${bookingAmount.toLocaleString('ru-RU')} ₸`}
          </button>
        </div>
        {submitError && <p style={{ color: '#E94949', marginTop: '10px' }}>{submitError}</p>}
      </div>
    </main>
  );
}
