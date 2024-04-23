import React, { useContext, useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import axios from 'axios'
import AuthContext from '../context/AuthContext';

export default function MyBookings() {
    const {authTokens} =useContext(AuthContext)
    const [userBooking, setUserBooking] = useState('')
    const [corridorNum, setCorridorNum] = useState('')
    const room = userBooking.room_number
    const floor= Math.round(room/100)

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Выполняем GET запрос
                const getResponse = await axios.get('get-bookings/', {
                    headers: {
                        'Authorization': `Bearer ${authTokens.access}`,
                    }
                });

                const res = getResponse.data
                setUserBooking(res[0].seat_detail)
                console.log("Пользователь забронировал: ", res);
            } catch (error) {
                // Обработка ошибок
                console.error('Error fetching data:', error);
            }
        };

        fetchData(); // Вызов функции для выполнения запроса при загрузке компонента
    }, []);
       

    useEffect(() => {
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

    console.log(userBooking);
  return (
    <div className='my-booking'>
        <Navbar/>
        <div className='my-booking-container'>
            <h1>Booking</h1>
            <h3>You have successfully completed your booking, the booking details are as follows:</h3>
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
                        <td>{userBooking.block}-Block</td>
                        <td>{floor}- floor</td>
                        <td>{corridorNum}- corridor</td>
                        <td>{room}-room</td>
                        <td>{userBooking.seat_number}-seat</td>
                    </tr>
                    <tr className='table-cost'>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td>Total cost: 195 000 KZT</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <footer></footer>
    </div>
  )
}
