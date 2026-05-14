import React, { useCallback, useContext, useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import axios from 'axios'
import AuthContext from '../context/AuthContext';

export default function MyBookings() {
    const {authTokens} =useContext(AuthContext)
    const [userBooking, setUserBooking] = useState(null)
    const [bookingId, setBookingId] = useState(null)
    const [corridorNum, setCorridorNum] = useState('')
    const [bookingStatus, setBookingStatus] = useState('Active booking')
    const [paymentStatus, setPaymentStatus] = useState('Pending')
    const [actionMessage, setActionMessage] = useState('')
    const [isCancelling, setIsCancelling] = useState(false)
    const [isDownloading, setIsDownloading] = useState(false)
    const room = userBooking?.room_number
    const floor = room ? Math.round(room / 100) : '-'
    const hasActiveBooking = Boolean(userBooking)

    const loadBookings = useCallback(async () => {
        try {
            const getResponse = await axios.get('get-bookings/', {
                headers: {
                    'Authorization': `Bearer ${authTokens.access}`,
                }
            });

            const res = getResponse.data
            if (res.length > 0) {
                setUserBooking(res[0].seat_detail)
                setBookingId(res[0].id)
                setBookingStatus('Confirmed')
            } else {
                setUserBooking(null)
                setBookingId(null)
                setBookingStatus('No active booking')
            }
        } catch (error) {
            console.error('Error fetching bookings:', error);
        }
    }, [authTokens]);

    const loadPaymentReceipt = useCallback(async () => {
        try {
            const response = await axios.get('payment/receipt/', {
                headers: {
                    'Authorization': `Bearer ${authTokens.access}`,
                }
            });
            const receiptStatus = response?.data?.receipt?.status;
            if (receiptStatus) {
                setPaymentStatus(receiptStatus);
                return;
            }
        } catch (error) {
            console.log('Payment receipt is not available yet');
        }

        const userProfile = JSON.parse(localStorage.getItem('userProfile'));
        if (userProfile?.is_dorm) {
            setPaymentStatus('Paid');
        } else {
            setPaymentStatus('Pending');
        }
    }, [authTokens]);

    useEffect(() => {
        loadBookings();
    }, [loadBookings]);

    useEffect(() => {
        loadPaymentReceipt();
    }, [loadPaymentReceipt]);

    useEffect(() => {
        if (!room) {
            return;
        }

        const recognizeCorridorNum = (room)=>{
            if (room) {
                let num = room % 100;
                console.log("num: " + num);
                
                if(num>=12 && num<=16){
                 setCorridorNum(2)
                }else if(num>=22 && num<=26){
                     setCorridorNum(3)
                }else if(num>=34 && num<=38){
                     setCorridorNum(4) 
                }else{
                    setCorridorNum(1)
                }
            }
        }
        recognizeCorridorNum(room);
    }, [room]); 

    const cancelBooking = async () => {
        if (!hasActiveBooking || isCancelling) {
            return;
        }

        setActionMessage('');
        setIsCancelling(true);
        try {
            await axios.post(
                'cancel-booking/',
                {},
                {
                    headers: {
                        'Authorization': `Bearer ${authTokens.access}`,
                    },
                }
            );
            setActionMessage('Booking cancelled successfully.');
            setPaymentStatus('Pending');
            localStorage.removeItem('currentBookingId');
            localStorage.removeItem('currentBookingAmount');
            await loadBookings();
        } catch (error) {
            setActionMessage(error?.response?.data?.error || 'Failed to cancel booking.');
        } finally {
            setIsCancelling(false);
        }
    };

    const downloadReceipt = async () => {
        if (isDownloading) {
            return;
        }

        setActionMessage('');
        setIsDownloading(true);
        try {
            const response = await axios.get('payment/download-receipt/', {
                headers: {
                    'Authorization': `Bearer ${authTokens.access}`,
                },
                responseType: 'blob',
            });

            const blobUrl = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
            const link = document.createElement('a');
            link.href = blobUrl;
            link.setAttribute('download', `receipt_${bookingId || 'dorm'}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(blobUrl);
        } catch (error) {
            setActionMessage('Receipt is not available yet.');
        } finally {
            setIsDownloading(false);
        }
    };

  return (
    <div className='my-booking'>
        <Navbar/>
        <div className='my-booking-container'>
            <h1>Booking</h1>
            <h3>You have successfully completed your booking, the booking details are as follows:</h3>
            <h3>Booking status: {bookingStatus} | Payment status: {paymentStatus}</h3>
            <div className='table-container'>
                <table className='table'>
                    <thead>
                        <tr className='header-table'>
                            <th>Block</th>
                            <th>Floor</th>
                            <th>Corridor</th>
                            <th>Room</th>
                            <th>Seat</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td data-label="Block">{hasActiveBooking ? `${userBooking.block}-Block` : '-'}</td>
                            <td data-label="Floor">{hasActiveBooking ? `${floor}-floor` : '-'}</td>
                            <td data-label="Corridor">{hasActiveBooking ? `${corridorNum}-corridor` : '-'}</td>
                            <td data-label="Room">{hasActiveBooking ? `${room}-room` : '-'}</td>
                            <td data-label="Seat">{hasActiveBooking ? `${userBooking.seat_number}-seat` : '-'}</td>
                        </tr>
                    </tbody>
                    <tfoot>
                        <tr className='table-cost'>
                            <td colSpan="5">Total cost: 195 000 KZT</td>
                        </tr>
                    </tfoot>
                </table>
            </div>
            <div style={{ marginTop: '18px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <button onClick={cancelBooking} disabled={!hasActiveBooking || isCancelling}>
                    {isCancelling ? 'Cancelling...' : 'Cancel booking'}
                </button>
                <button onClick={downloadReceipt} disabled={isDownloading}>
                    {isDownloading ? 'Downloading...' : 'Download receipt (PDF)'}
                </button>
            </div>
            {actionMessage && (
                <p style={{ marginTop: '10px', color: actionMessage.includes('successfully') ? '#00A35D' : '#E94949' }}>
                    {actionMessage}
                </p>
            )}
        </div>
        <footer></footer>
    </div>
  )
}
