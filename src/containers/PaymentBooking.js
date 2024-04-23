import React, { useContext, useState } from 'react'
import Navbar from '../components/Navbar'
import InputMask from 'react-input-mask'
import { Link } from 'react-router-dom';
import axios from 'axios'
import AuthContext from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function PaymentBooking() {
    const [expiry, setExpiry] = useState('');
    const [cardNumber, setCardNumber] = useState('');
    const [cvv, setCvv] = useState('');
    

    const { authTokens } = useContext(AuthContext)
    const navigate = useNavigate()

    const submitPayment = async () =>{
        const userID = JSON.parse(localStorage.getItem('userID'))
        const booking = userID.id_user
        console.log(userID);
        const amount = 195000 

        if(!booking || !expiry || !cvv || !cardNumber){
            console.log('Нету userID, либо забыли заполнить input');
        }else{
            try{
                const response = await axios.post('payment/', 
                {
                  amount, booking   
                },
                {
                    headers: {
                        'Authorization': `Bearer ${authTokens.access}`,
                    }
                } )

                const res =  response.data;
                console.log(res);
                navigate('/main-page')
            }catch(err){
                console.error(err);
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
                    <h2>Payment</h2>
                    <h2>195 000 ₸</h2>
                    <div>
                        <img src={require('../img/visa.png')} alt="visa"/>
                        <img src={require('../img/mastercard.png')} alt="mastercard"/>
                    </div>
                </div>
                <form className='form-payment'>
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
                    <button onClick={()=>submitPayment()}>Pay</button>
                    <Link to='/confirmation-booking'><button>Back</button></Link>
                </div>
            <div>
          </div>
        </div>
    </main>
  )
}
