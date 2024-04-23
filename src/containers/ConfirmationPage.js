import React, { useState } from 'react'
import Navbar from '../components/Navbar'
import { Link } from 'react-router-dom'
import Modal from 'react-modal';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'
import AuthContext from '../context/AuthContext'
import { useContext } from 'react'


export default function ConfirmationPage() {
  const dataOfUserReserved =JSON.parse(localStorage.getItem('dataSelectedToReserverByUser'))
  const corridorSelected = dataOfUserReserved.selectedCorridor
  const onlyCorridorNum = corridorSelected.substring(0, 15)
  const [isModalOpen, setModalOpen] = useState(false)
  const [userReserved, setUserReserved] = useState('')

  const { authTokens } =useContext(AuthContext);

  const block = dataOfUserReserved.selectedBlock.charAt(0)
  const room_number = dataOfUserReserved.roomNumber
  const seat_number = dataOfUserReserved.selectedSeatPlace
  const semester_duration = dataOfUserReserved.selectedSemester.charAt(0)
 
const submitSeatPlace = async () =>{
    if(!dataOfUserReserved.selectedBlock && !dataOfUserReserved.roomNumber && !dataOfUserReserved.selectedSeatPlace && !dataOfUserReserved.selectedSemester){
        console.log("Не все данные выбраны! Пожалуйста попробуйте снова");
    }else{
        try{
            const response =await axios.post('bookings/', 
            {
                block, room_number, seat_number, semester_duration 
            },
            {
                headers: {
                    'Authorization': `Bearer ${authTokens.access}`,
                }
            } )

            const res =  response.data;
            console.log(res);

            // Ждем 3 секунды перед выполнением следующего запроса
            setTimeout(async () => {
                try {
                    // Выполняем GET запрос с задержкой 3 секунды
                    const getResponse = await axios.get('get-bookings/', {
                        headers: {
                            'Authorization': `Bearer ${authTokens.access}`,
                        }
                    });

                    const res = getResponse.data
                    setUserReserved(res)

                    console.log("Пользователь забронировал: ", getResponse.data);
                    // console.log("ID пользователя: ");
                    localStorage.setItem('userID', JSON.stringify({id_user:res[0].id}))
                } catch (error) {
                    console.error("Ошибка при выполнении GET запроса:", error);
                }
            }, 3000);
      }catch(err){
        console.error("Ошибка при выполнении POST запроса:", err);
      }
    }
}

const handleOpenModal = ()=> {
    setModalOpen(true)
}

const handleCloseModal = () =>{
    setModalOpen(false)
}

const handleClickCancel = () =>{
    setModalOpen(false)
}

  return (
    <main className='confirmation-data'>
        <Navbar/>
        <div className='background-of-confirmation'>
            <div className='confirmation-content'>
                <div className='confirmation-info-left'>
                    <img src={require('../img/logoDorm.png')} alt="logo"/>
                    <div className='txt-details'>
                        <h2>Confirmation</h2>
                        <p>Here, the details of the seat you are choosing are shown. Check carefully!</p>
                    </div>
                    <div className='me-selected'>
                        <h3 className='me-selected-text'>You Selected:</h3>
                        <div>
                            <h3>Block: {dataOfUserReserved.selectedBlock}</h3>
                            <h3>Corridor: {onlyCorridorNum}</h3>
                            <h3>Room and seat: {dataOfUserReserved.roomNumber},  {dataOfUserReserved.selectedSeatPlace} - seat</h3>
                        </div>
                    </div>
                </div>
                <div className='confirmation-info-right'>
                    <div>
                        <p>Abylay Khan Street, 1/1</p>
                        <h3>SDU Dormitory, Kaskelen</h3>
                    </div>
                    <h3>Total cost: 195,000 ₸</h3>
                </div>
            </div>
            <div className='btns-confirmation'>
                <button onClick={()=>handleOpenModal()}>Cancel booking</button>
                <Modal className='modal' isOpen={isModalOpen} onRequestClose={()=> handleCloseModal()}>
                    <h3>Do you really cancel the reservation?</h3>
                    <div className='btns-modal btns-modal-cancel'>
                        <button onClick={()=>{handleCloseModal()}}>No, I will not cancel</button>
                        <Link to='/booking'><button className='btn-cancel' onClick={()=>handleClickCancel()}>Yes, cancel</button></Link>
                    </div>
                </Modal>
                <button><Link>Previous step</Link></button>
                <Link to="/payment-booking">
                    <button className='btn-to-payment' onClick={()=>submitSeatPlace()}>Pay: 195 0000 ₸</button>
                </Link>
            </div>
        </div>
    </main>
  )
}
