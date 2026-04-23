import React, { useContext, useMemo, useState } from 'react';
import Navbar from '../components/Navbar';
import InputMask from 'react-input-mask';
import { Link } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function PaymentBooking() {
    const [expiry, setExpiry] = useState('');
    const [cardNumber, setCardNumber] = useState('');
    const [cvv, setCvv] = useState('');
    const [paymentError, setPaymentError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { authTokens } = useContext(AuthContext);
    const navigate = useNavigate();
    const { t } = useTranslation();

    const bookingId = useMemo(() => localStorage.getItem('currentBookingId'), []);
    const amount = useMemo(() => Number(localStorage.getItem('currentBookingAmount') || 195000), []);

    const submitPayment = async () =>{
        if(!bookingId || !expiry || !cvv || !cardNumber){
            setPaymentError(t('payment.fillAll'));
        }else{
            try{
                setIsSubmitting(true)
                setPaymentError('')
                const response = await axios.post('payment/', 
                {
                  amount, booking: bookingId, provider: 'manual'
                },
                {
                    headers: {
                        'Authorization': `Bearer ${authTokens.access}`,
                    }
                } )

                const res =  response.data;
                console.log(res);
                localStorage.removeItem('bookingDraft');
                navigate('/congrats-booking');
            }catch(err){
                console.error(err);
                setPaymentError('Payment failed. Please check card details or try again.')
            } finally {
                setIsSubmitting(false)
            }
        }
    }

    const handleExpiryChange = (event) => {
        const inputExpiry = event.target.value;
        setExpiry(inputExpiry);
    };

    const handleCardNumberChange = (event) => {
        let inputCardNumber = event.target.value;

        // Удаляем пробелы из введенного номера карты
        inputCardNumber = inputCardNumber.replace(/\s/g, '');

        // Проверяем, является ли длина номера карты кратной 4, если нет, то это удаление цифры
        if (inputCardNumber.length < cardNumber.replace(/\s/g, '').length) {
        inputCardNumber = inputCardNumber.replace(/(.{4})/g, '$1 ').trim();
        } else {
        // Добавляем пробел после каждых 4 цифр
        inputCardNumber = inputCardNumber.replace(/(.{4})/g, '$1 ').trim();
        }

        // Устанавливаем новое значение номера карты с пробелами
        setCardNumber(inputCardNumber);
  };

  return (
    <main className='payment'>
        <Navbar/>
        <div className='background-payment'>
                <div className='payment-header'>
                    <h2>{t('payment.title')}</h2>
                    <h2>{amount.toLocaleString('ru-RU')} ₸</h2>
                    <div>
                        <img src={require('../img/visa.png')} alt="visa"/>
                        <img src={require('../img/mastercard.png')} alt="mastercard"/>
                    </div>
                </div>
                <form className='form-payment'>
                    {!bookingId && (
                        <p style={{ color: '#E94949' }}>
                            Booking was not found. Please return to booking step.
                        </p>
                    )}
                    <div className="field-component">
                        <label>Card Number</label>
                        <input 
                            type="text"
                            value={cardNumber}
                            onChange={handleCardNumberChange}
                            maxLength={19}
                            placeholder="4400 **** **** ****"
                        />
                    </div>
                    <div className='payment-cvv-mm'>
                        <div className="field-component">
                            <label htmlFor="expiry">It works according to</label>
                            <InputMask
                            mask="99/99"
                            value={expiry}
                            onChange={handleExpiryChange}
                            placeholder="mm/yy"
                            />
                        </div>
                        <div className="field-component">
                            <label>CVV</label>
                            <input 
                                type="text"
                                value={cvv}
                                onChange={(e) => setCvv(e.target.value)}
                                maxLength={3}
                                placeholder="***"
                            />
                        </div>
                    </div>
                </form>
                <div className='btns-payment'>
                    <button onClick={()=>submitPayment()} disabled={isSubmitting}>
                        {isSubmitting ? t('payment.processing') : t('payment.pay')}
                    </button>
                    <Link to='/confirmation-booking'><button>{t('payment.back')}</button></Link>
                </div>
                {paymentError && <p style={{ marginTop: '12px', color: '#E94949' }}>{paymentError}</p>}
            <div>
          </div>
        </div>
    </main>
  )
}
