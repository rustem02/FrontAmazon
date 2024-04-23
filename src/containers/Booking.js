import React, { createContext, useContext, useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import { Link, Navigate } from 'react-router-dom'
import AuthContext from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Modal from 'react-modal';

export default function Booking() {
    const navigate = useNavigate()
    const {authTokens} =useContext(AuthContext)
    const [step, setStep] = useState(1);
    const [selectedBlock, setSelectedBlock] = useState("");
    const [selectedSemester, setSelectedSemester] = useState("");
    const [selectedFloor, setSelectedFloor] = useState("");
    const [selectedCorridor, setSelectedCorridor] = useState("");
    const [selectedCorridorNumDuration, setSelectedCorridorNumDuration] = useState("");
    const [reservedUsers, setReservedUsers] = useState("");
    const [selectedSeatPlace, setSelectedSeatPlace] = useState("");
    const [selectedSeatID, setSelectedSeatID] = useState("");
    const [roomNumber, setRoomNumber] = useState("");
    const [isModalOpen, setModalOpen] = useState(false)

    const gender = authTokens.user.gender

    const handleConfirm = () =>{
      if (selectedSeatPlace !== '') {
        navigate('/confirmation-booking');
      }else{
        alert('Сперва выберите место для бронирования!')
      }
    }
    const handleOpenModal = ()=> {
        setModalOpen(true)
    }

    const handleCloseModal = () =>{
        setModalOpen(false)
    }

    const handleClickRestart = () =>{
        setSelectedBlock('')
        setSelectedCorridor('')
        setSelectedCorridorNumDuration('')
        setSelectedFloor('')
        setSelectedSeatPlace('')
        setSelectedSemester('')
        setRoomNumber('')
        setStep(1)
        setModalOpen(false)
    }

    const handleBlockClick = (block) => {
      setSelectedBlock(block);
    };

    const handleNextClick = () => {
        if(selectedBlock){
            setStep(2)
        }
    };

    const handleAvailibilityClick = () => {
        if(selectedCorridor && selectedFloor){
            setStep(3)
        }
        
    };

    const handleFloorChange = (event) => {
        setSelectedFloor(event.target.value);
        // Сброс выбранного коридора при смене этажа
        setSelectedCorridor('');
    };

    const handleSemesterChange = (event) => {
      setSelectedSemester(event.target.value);
  };

    const handleCorridorChange = (event) => {
        const corridor = event.target.value;
        const corridorNumDuration = corridor.substring(16, 22);
        setSelectedCorridor(event.target.value);
        setSelectedCorridorNumDuration(corridorNumDuration)
    };

    console.log("Selected Seat Number: ",selectedCorridorNumDuration);

    const handleClickSeatPlaceRoomNumber = (seatID ,seatNumber) =>{
      setSelectedSeatPlace(seatNumber); 
      setSelectedSeatID(seatID)
      
      let roomNumber;

      if (seatID >= 1 && seatID <= 4) {
        roomNumber = roomNumbersArray[0];
      } else if (seatID >= 5 && seatID <= 8) {
        roomNumber = roomNumbersArray[1];
      } else if (seatID >= 9 && seatID <= 12) {
        roomNumber = roomNumbersArray[2];
      } else if (seatID >= 13 && seatID <= 16) {
        roomNumber = roomNumbersArray[3];
      } else if (seatID >= 17 && seatID <= 20) {
        roomNumber = roomNumbersArray[4];
      }
    
      setRoomNumber(roomNumber);
    }

    const handleClickBack = () =>{
      if(selectedBlock){
        setStep(2)
        setSelectedSemester('')
        setSelectedCorridor('')
        setSelectedFloor('')
        setSelectedSeatPlace('')
        setSelectedCorridorNumDuration('')
        setRoomNumber('')
    }
    }


    // Функция для создания строк коридоров в зависимости от выбранного этажа
    const getCorridorOptions = (floorNumber) => {
        const baseNumbers = ['01-05', '12-16', '22-26', '34-38'];
        return baseNumbers.map((base, index) => {
        const corridorNumber = `${floorNumber}${base}`;
        var rettik = '';
        if(index == 0){
            rettik = 'st'
        }else if(index == 1){
            rettik = 'nd'
        }else if(index == 2){
            rettik = 'rd'
        }else if(index == 3){
            rettik = 'th'
        }
        const descriptions = [
            'closer to the kitchen',
            'closer to the study room',
            'closer to the Iron Room',
            'closer to the rest room'
        ];
        return `${index+1}${rettik} - corridor [${corridorNumber}: ${descriptions[index]}]`;
        });
    };

    // Динамическое создание опций для коридоров
    const corridorOptions = selectedFloor ? getCorridorOptions(selectedFloor.charAt(0)) : [];

    function createRoomNumberArray (corridorRange){
        const [start, end] = corridorRange.split('-');
        const startNumber = parseInt(start);
        const endNumber = parseInt(start.slice(0, -2) + end);
        const roomNumbers = [];
        console.log("Начальная цифра: " + startNumber);
        console.log("Конечная цифра: " + endNumber);

        for (let i = startNumber; i <= endNumber; i++) {
            roomNumbers.push(i);
        }

        return roomNumbers;
    }
    const roomNumbersArray = createRoomNumberArray(selectedCorridorNumDuration);
    console.log("Выбранное место: ",selectedSeatPlace);
    console.log("Выбранное комната: ", roomNumber);

    useEffect(()=>{
        const getAllRoomsInformation = async() =>{
            try{
                const response = axios.get('rooms/',{
                    headers: {
                        Authorization: `Bearer ${authTokens.access}` // Добавляем токен для аутентификации запроса
                      }
                })

                const res = (await response).data;
                console.log(res);

                // Создаем массив только с бронированными пользователями
                const reservedUsers = res.filter(doc => doc.is_reserved).map(doc => doc);
                console.log("Пользователи которые забронировали: ", reservedUsers);

                setReservedUsers(reservedUsers); 
            }catch(err){
                console.error('Ошибка при получении списка документов:', err);
            }
        }
        getAllRoomsInformation()
    },[authTokens]);

    localStorage.setItem('dataSelectedToReserverByUser', JSON.stringify({selectedBlock:selectedBlock, selectedCorridor:selectedCorridor, selectedSeatPlace:selectedSeatPlace, roomNumber:roomNumber,step:step,selectedSemester:selectedSemester}))
  return (
    <main className='booking'>
        <Navbar selectedBlock = {selectedBlock}/>
        <div className='wrapper booking-content'>
            <div className='booking-system'>
                <div>
                    <img src={require('../img/logoDorm.png')} alt="booking-logo"/> 
                    <h2>Booking</h2>
                    <p className='txt'>You can book a place for yourself inside the DORM on this page of the platform. Have a good booking!</p>
                    {step === 1 && (
                        <>
                            <p>Please, select the block</p>
                            <div className='btn-group'>
                            {gender === 'Male' ? (
                                <>
                                    <button className={`block ${selectedBlock === 'C-block' ? 'selected' : ''}`}
                                    onClick={() => handleBlockClick('C-block')} >C-block</button>
                                    <button className={`block ${selectedBlock === 'D-block' ? 'selected' : ''}`}
                                    onClick={() => handleBlockClick('D-block')}>D-block</button>
                                </>
                              ) : (
                                <>
                                    <button className={`block ${selectedBlock === 'A-block' ? 'selected' : ''}`}
                                    onClick={() => handleBlockClick('A-block')} >A-block</button>
                                    <button className={`block ${selectedBlock === 'B-block' ? 'selected' : ''}`}
                                    onClick={() => handleBlockClick('B-block')}>B-block</button>
                                </>
                              )}
                            </div>
                            <button className='btn-next'
                            disabled={!selectedBlock}
                            onClick={handleNextClick}>
                                Next
                            </button>
                        </>
                    )}
                    {step === 2 && (
                        <div className='selection'>
                            <div className='btn-group' style={{ marginBottom: '42px' }}>
                                {gender === 'Male' ? (
                                    <>
                                        <button className={`block ${selectedBlock === 'C-block' ? 'selected' : ''}`}
                                        onClick={() => handleBlockClick('C-block')} >C-block</button>
                                        <button className={`block ${selectedBlock === 'D-block' ? 'selected' : ''}`}
                                        onClick={() => handleBlockClick('D-block')}>D-block</button>
                                    </>
                                ) : (
                                    <>
                                        <button className={`block ${selectedBlock === 'A-block' ? 'selected' : ''}`}
                                        onClick={() => handleBlockClick('A-block')} >A-block</button>
                                        <button className={`block ${selectedBlock === 'B-block' ? 'selected' : ''}`}
                                        onClick={() => handleBlockClick('B-block')}>B-block</button>
                                    </>
                                )}
                            </div>
                            <div className='floor-selection'>
                                <select id="floor-select" value={selectedFloor} onChange={handleFloorChange}>
                                    <option value="">Select the floor</option> {/* Опция по умолчанию */}
                                    <option value="2nd-floor">2nd floor</option> {/* Значения для этажей */}
                                    <option value="3rd-floor">3rd floor</option>
                                    <option value="4th-floor">4th floor</option>
                                    <option value="5th-floor">5th floor</option>
                                </select>
                            </div>
                            <div className='corridor-selection'>
                                <select id="corridor-select" value={selectedCorridor} onChange={handleCorridorChange}>
                                    <option value="">Select the corridor</option>
                                    {corridorOptions.map((option, index) => (
                                        <option key={index} value={`${option}`}>{option}</option>
                                    ))}
                                </select>
                            </div>
                            <div className='semester-selection'>
                                <select id="semester-select" value={selectedSemester} onChange={handleSemesterChange}>
                                    <option value="">Select the semester</option> {/* Опция по умолчанию */}
                                    <option value="1st-semester">1st-semester</option> {/* Значения для этажей */}
                                    <option value="2nd-semester">2nd-semester</option>
                                </select>
                            </div>
                            <button className='btn-show-availability'
                            disabled={!selectedCorridor && !selectedFloor}
                            onClick={handleAvailibilityClick}>
                                Show availability
                            </button>
                        </div>
                    )}
                    {step === 3 && (
                        <div className='selection'>
                            <div className='btn-group' style={{ marginBottom: '42px' }}>
                                {gender === 'Male' ? (
                                    <>
                                        <button className={`block ${selectedBlock === 'C-block' ? 'selected' : ''}`} disabled={selectedBlock}>C-block</button>
                                        <button className={`block ${selectedBlock === 'D-block' ? 'selected' : ''}`} disabled={selectedBlock}>D-block</button>
                                    </>
                                ) : (
                                    <>
                                        <button className={`block ${selectedBlock === 'A-block' ? 'selected' : ''}`} disabled={selectedBlock}>A-block</button>
                                        <button className={`block ${selectedBlock === 'B-block' ? 'selected' : ''}`} disabled={selectedBlock}>B-block</button>
                                    </>
                                )}
                            </div>
                            <div className='floor-selection'>
                                <select id="floor-select" value={selectedFloor} disabled={selectedFloor}>
                                    <option value="">Select the floor</option>
                                    <option value="2nd-floor">2nd floor</option> 
                                    <option value="3rd-floor">3rd floor</option>
                                    <option value="4th-floor">4th floor</option>
                                    <option value="5th-floor">5th floor</option>
                                </select>
                            </div>
                            <div className='corridor-selection'>
                                <select id="corridor-select" value={selectedCorridor} disabled={selectedCorridor}>
                                    <option value="">Select the corridor</option>
                                    {corridorOptions.map((option, index) => (
                                        <option key={index} value={`${option}`}>{option}</option>
                                    ))}
                                </select>
                            </div>
                            <div className='semester-selection'>
                                <select id="semester-select" value={selectedSemester} disabled={selectedSemester}>
                                    <option value="">Select the semester</option> {/* Опция по умолчанию */}
                                    <option value="1st-semester">1st-semester</option> {/* Значения для этажей */}
                                    <option value="2nd-semester">2nd-semester</option>
                                </select>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <div className='booking-video'>
                <div className='instructional-video' style={{marginLeft: step === 3 ?  '24px': '84px' }}>
                    <img src={require('../img/booking-illustration.png')} alt="booking-illustration"/> 
                    <p>If you need an instructional video,<Link> click here</Link></p>
                </div>
                {step === 3 && (
                    <div className='booking-visually'>
                    <div className='seats'>
                        <div className='seat-1'>
                            <div className='seat-visual'>
                                <div className='seat-visual-item'></div>
                                <div className='seat-visual-item'></div>
                            </div>
                            
                            <div className='seat-places'>
                                <div>
                                    <button className='seat-place' 
                                    onClick={()=> handleClickSeatPlaceRoomNumber(20, 4)}
                                    disabled={reservedUsers.some(reserved =>
                                        reserved.seat_number == '4' &&
                                        reserved.block == selectedBlock.charAt(0) &&
                                        reserved.room_number == roomNumbersArray[4]
                                      )}
                                    style={{
                                        backgroundColor: reservedUsers.some(reserved =>
                                          reserved.seat_number == '4' &&
                                          reserved.block == selectedBlock.charAt(0) &&
                                          reserved.room_number == roomNumbersArray[4]
                                        ) ? '#E94949' : selectedSeatID === 20 ? '#F3A367' : '#00A35D',
                                      }}>
                                        4
                                    </button>
                                    <button className='seat-place'
                                    onClick={()=> handleClickSeatPlaceRoomNumber(19, 3)}
                                    disabled={reservedUsers.some(reserved =>
                                        reserved.seat_number == '3' &&
                                        reserved.block == selectedBlock.charAt(0) &&
                                        reserved.room_number == roomNumbersArray[4]
                                      )}
                                    style={{
                                        backgroundColor: reservedUsers.some(reserved =>
                                          reserved.seat_number == '3' &&
                                          reserved.block == selectedBlock.charAt(0) &&
                                          reserved.room_number == roomNumbersArray[4]
                                        ) ? '#E94949' : selectedSeatID === 19 ? '#F3A367' : '#00A35D'
                                      }}>3</button>
                                </div>
                                <p className='room-num'>{roomNumbersArray[4]}-room</p>
                                <div>
                                    <button className='seat-place'
                                    onClick={()=> handleClickSeatPlaceRoomNumber(18, 2)}
                                    disabled={reservedUsers.some(reserved =>
                                        reserved.seat_number == '2' &&
                                        reserved.block == selectedBlock.charAt(0) &&
                                        reserved.room_number == roomNumbersArray[4]
                                      )}
                                    style={{
                                        backgroundColor: reservedUsers.some(reserved =>
                                          reserved.seat_number == '2' &&
                                          reserved.block == selectedBlock.charAt(0) &&
                                          reserved.room_number == roomNumbersArray[4]
                                        ) ? '#E94949' : selectedSeatID === 18 ? '#F3A367' : '#00A35D'
                                      }}>2</button>
                                    <button className='seat-place'
                                    onClick={()=> handleClickSeatPlaceRoomNumber(17, 1)}
                                    disabled={reservedUsers.some(reserved =>
                                        reserved.seat_number == '1' &&
                                        reserved.block == selectedBlock.charAt(0) &&
                                        reserved.room_number == roomNumbersArray[4]
                                      )}
                                    style={{
                                        backgroundColor: reservedUsers.some(reserved =>
                                          reserved.seat_number == '1' &&
                                          reserved.block == selectedBlock.charAt(0) &&
                                          reserved.room_number == roomNumbersArray[4]
                                        ) ? '#E94949' : selectedSeatID === 17 ? '#F3A367' : '#00A35D'
                                      }}>1</button>
                                </div>
                            </div>

                            <div className='seat-visual-door'>
                                <div className='seat-door-item'></div>
                                <p>door</p>
                            </div>
                        </div>
                        <div className='seat-1'>
                            <div className='seat-visual'>
                                <div className='seat-visual-item'></div>
                                <div className='seat-visual-item'></div>
                            </div>
                            
                            <div className='seat-places'>
                                <div>
                                    <button className='seat-place'
                                    onClick={()=> handleClickSeatPlaceRoomNumber(16, 4)}
                                    disabled={reservedUsers.some(reserved =>
                                        reserved.seat_number == '4' &&
                                        reserved.block == selectedBlock.charAt(0) &&
                                        reserved.room_number == roomNumbersArray[3]
                                      )}
                                    style={{
                                        backgroundColor: reservedUsers.some(reserved =>
                                          reserved.seat_number == '4' &&
                                          reserved.block == selectedBlock.charAt(0) &&
                                          reserved.room_number == roomNumbersArray[3]
                                        ) ? '#E94949' : selectedSeatID === 16 ? '#F3A367' : '#00A35D'
                                      }}>4</button>
                                    <button className='seat-place'
                                    onClick={()=> handleClickSeatPlaceRoomNumber(15, 3)}
                                    disabled={reservedUsers.some(reserved =>
                                        reserved.seat_number == '3' &&
                                        reserved.block == selectedBlock.charAt(0) &&
                                        reserved.room_number == roomNumbersArray[3]
                                      )}
                                    style={{
                                        backgroundColor: reservedUsers.some(reserved =>
                                          reserved.seat_number == '3' &&
                                          reserved.block == selectedBlock.charAt(0) &&
                                          reserved.room_number == roomNumbersArray[3]
                                        ) ? '#E94949' : selectedSeatID === 15 ? '#F3A367' : '#00A35D'
                                      }}>3</button>
                                </div>
                                <p className='room-num'>{roomNumbersArray[3]}-room</p>
                                <div>
                                    <button className='seat-place'
                                    onClick={()=> handleClickSeatPlaceRoomNumber(14, 2)}
                                    disabled={reservedUsers.some(reserved =>
                                        reserved.seat_number == '2' &&
                                        reserved.block == selectedBlock.charAt(0) &&
                                        reserved.room_number == roomNumbersArray[3]
                                      )}
                                    style={{
                                        backgroundColor: reservedUsers.some(reserved =>
                                          reserved.seat_number == '2' &&
                                          reserved.block == selectedBlock.charAt(0) &&
                                          reserved.room_number == roomNumbersArray[3]
                                        ) ? '#E94949' : selectedSeatID === 14 ? '#F3A367' : '#00A35D'
                                      }}>2</button>
                                    <button className='seat-place'
                                    onClick={()=> handleClickSeatPlaceRoomNumber(13, 1)}
                                    disabled={reservedUsers.some(reserved =>
                                        reserved.seat_number == '1' &&
                                        reserved.block == selectedBlock.charAt(0) &&
                                        reserved.room_number == roomNumbersArray[3]
                                      )}
                                    style={{
                                        backgroundColor: reservedUsers.some(reserved =>
                                          reserved.seat_number == '1' &&
                                          reserved.block == selectedBlock.charAt(0) &&
                                          reserved.room_number == roomNumbersArray[3]
                                        ) ? '#E94949' : selectedSeatID === 13 ? '#F3A367' : '#00A35D'
                                      }}>1</button>
                                </div>
                            </div>

                            <div className='seat-visual-door'>
                                <div className='seat-door-item'></div>
                                <p>door</p>
                            </div>
                        </div>
                        <div className='seat-1'>
                            <div className='seat-visual'>
                                <div className='seat-visual-item'></div>
                                <div className='seat-visual-item'></div>
                            </div>
                            
                            <div className='seat-places'>
                                <div>
                                    <button className='seat-place'
                                    onClick={()=> handleClickSeatPlaceRoomNumber(12, 4)}
                                    disabled={reservedUsers.some(reserved =>
                                        reserved.seat_number == '4' &&
                                        reserved.block == selectedBlock.charAt(0) &&
                                        reserved.room_number == roomNumbersArray[2]
                                      )}
                                    style={{
                                        backgroundColor: reservedUsers.some(reserved =>
                                          reserved.seat_number == '4' &&
                                          reserved.block == selectedBlock.charAt(0) &&
                                          reserved.room_number == roomNumbersArray[2]
                                        ) ? '#E94949' : selectedSeatID === 12 ? '#F3A367' : '#00A35D'
                                      }}>4</button>
                                    <button className='seat-place'
                                    onClick={()=> handleClickSeatPlaceRoomNumber(11, 3)}
                                    disabled={reservedUsers.some(reserved =>
                                        reserved.seat_number == '3' &&
                                        reserved.block == selectedBlock.charAt(0) &&
                                        reserved.room_number == roomNumbersArray[2]
                                      )}
                                    style={{
                                        backgroundColor: reservedUsers.some(reserved =>
                                          reserved.seat_number == '3' &&
                                          reserved.block == selectedBlock.charAt(0) &&
                                          reserved.room_number == roomNumbersArray[2]
                                        ) ? '#E94949' : selectedSeatID === 11 ? '#F3A367' : '#00A35D'
                                      }}>3</button>
                                </div>
                                <p className='room-num'>{roomNumbersArray[2]}-room</p>
                                <div>
                                    <button className='seat-place'
                                    onClick={()=> handleClickSeatPlaceRoomNumber(10, 2)}
                                    disabled={reservedUsers.some(reserved =>
                                        reserved.seat_number == '2' &&
                                        reserved.block == selectedBlock.charAt(0) &&
                                        reserved.room_number == roomNumbersArray[2]
                                      )}
                                    style={{
                                        backgroundColor: reservedUsers.some(reserved =>
                                          reserved.seat_number == '2' &&
                                          reserved.block == selectedBlock.charAt(0) &&
                                          reserved.room_number == roomNumbersArray[2]
                                        ) ? '#E94949' : selectedSeatID === 10 ? '#F3A367' : '#00A35D'
                                      }}>2</button>
                                    <button className='seat-place'
                                    onClick={()=> handleClickSeatPlaceRoomNumber(9, 1)}
                                    disabled={reservedUsers.some(reserved =>
                                        reserved.seat_number == '1' &&
                                        reserved.block == selectedBlock.charAt(0) &&
                                        reserved.room_number == roomNumbersArray[2]
                                      )}
                                    style={{
                                        backgroundColor: reservedUsers.some(reserved =>
                                          reserved.seat_number == '1' &&
                                          reserved.block == selectedBlock.charAt(0) &&
                                          reserved.room_number == roomNumbersArray[2]
                                        ) ? '#E94949' : selectedSeatID === 9 ? '#F3A367' : '#00A35D'
                                      }}>1</button>
                                </div>
                            </div>

                            <div className='seat-visual-door'>
                                <div className='seat-door-item'></div>
                                <p>door</p>
                            </div>
                        </div>
                        <div className='seat-1'>
                            <div className='seat-visual'>
                                <div className='seat-visual-item'></div>
                                <div className='seat-visual-item'></div>
                            </div>
                            
                            <div className='seat-places'>
                                <div>
                                    <button className='seat-place'
                                    onClick={()=> handleClickSeatPlaceRoomNumber(8, 4)}
                                    disabled={reservedUsers.some(reserved =>
                                        reserved.seat_number == '4' &&
                                        reserved.block == selectedBlock.charAt(0) &&
                                        reserved.room_number == roomNumbersArray[1]
                                      )}
                                    style={{
                                        backgroundColor: reservedUsers.some(reserved =>
                                          reserved.seat_number == '4' &&
                                          reserved.block == selectedBlock.charAt(0) &&
                                          reserved.room_number == roomNumbersArray[1]
                                        ) ? '#E94949' : selectedSeatID === 8 ? '#F3A367' : '#00A35D'
                                      }}>4</button>
                                    <button className='seat-place'
                                    onClick={()=> handleClickSeatPlaceRoomNumber(7, 3)}
                                    disabled={reservedUsers.some(reserved =>
                                        reserved.seat_number == '3' &&
                                        reserved.block == selectedBlock.charAt(0) &&
                                        reserved.room_number == roomNumbersArray[1]
                                      )}
                                    style={{
                                        backgroundColor: reservedUsers.some(reserved =>
                                          reserved.seat_number == '3' &&
                                          reserved.block == selectedBlock.charAt(0) &&
                                          reserved.room_number == roomNumbersArray[1]
                                        ) ? '#E94949' : selectedSeatID === 7 ? '#F3A367' : '#00A35D'
                                      }}>3</button>
                                </div>
                                <p className='room-num'>{roomNumbersArray[1]}-room</p>
                                <div>
                                    <button className='seat-place'
                                    onClick={()=> handleClickSeatPlaceRoomNumber(6, 2)}
                                    disabled={reservedUsers.some(reserved =>
                                        reserved.seat_number == '2' &&
                                        reserved.block == selectedBlock.charAt(0) &&
                                        reserved.room_number == roomNumbersArray[1]
                                      )}
                                    style={{
                                        backgroundColor: reservedUsers.some(reserved =>
                                          reserved.seat_number == '2' &&
                                          reserved.block == selectedBlock.charAt(0) &&
                                          reserved.room_number == roomNumbersArray[1]
                                        ) ? '#E94949' : selectedSeatID === 6 ? '#F3A367' : '#00A35D'
                                      }}>2</button>
                                    <button className='seat-place'
                                    onClick={()=> handleClickSeatPlaceRoomNumber(5, 1)}
                                    disabled={reservedUsers.some(reserved =>
                                        reserved.seat_number == '1' &&
                                        reserved.block == selectedBlock.charAt(0) &&
                                        reserved.room_number == roomNumbersArray[1]
                                      )}
                                    style={{
                                        backgroundColor: reservedUsers.some(reserved =>
                                          reserved.seat_number == '1' &&
                                          reserved.block == selectedBlock.charAt(0) &&
                                          reserved.room_number == roomNumbersArray[1]
                                        ) ? '#E94949' : selectedSeatID === 5 ? '#F3A367' : '#00A35D'
                                      }}>1</button>
                                </div>
                            </div>

                            <div className='seat-visual-door'>
                                <div className='seat-door-item'></div>
                                <p>door</p>
                            </div>
                        </div>
                        <div className='seat-1'>
                            <div className='seat-visual'>
                                <div className='seat-visual-item'></div>
                                <div className='seat-visual-item'></div>
                            </div>
                            
                            <div className='seat-places'>
                                <div>
                                    <button className='seat-place'
                                    onClick={()=> handleClickSeatPlaceRoomNumber(4, 4)}
                                    disabled={reservedUsers.some(reserved =>
                                        reserved.seat_number == '4' &&
                                        reserved.block == selectedBlock.charAt(0) &&
                                        reserved.room_number == roomNumbersArray[0]
                                      )}
                                    style={{
                                        backgroundColor: reservedUsers.some(reserved =>
                                          reserved.seat_number == '4' &&
                                          reserved.block == selectedBlock.charAt(0) &&
                                          reserved.room_number == roomNumbersArray[0]
                                        ) ? '#E94949' : selectedSeatID === 4 ? '#F3A367' : '#00A35D'
                                      }}>4</button>
                                    <button className='seat-place'
                                    onClick={()=> handleClickSeatPlaceRoomNumber(3, 3)}
                                    disabled={reservedUsers.some(reserved =>
                                        reserved.seat_number == '3' &&
                                        reserved.block == selectedBlock.charAt(0) &&
                                        reserved.room_number == roomNumbersArray[0]
                                      )}
                                    style={{
                                        backgroundColor: reservedUsers.some(reserved =>
                                          reserved.seat_number == '3' &&
                                          reserved.block == selectedBlock.charAt(0) &&
                                          reserved.room_number == roomNumbersArray[0]
                                        ) ? '#E94949' : selectedSeatID === 3 ? '#F3A367' : '#00A35D'
                                      }}>3</button>
                                </div>
                                <p className='room-num'>{roomNumbersArray[0]}-room</p>
                                <div>
                                    <button className='seat-place'
                                    onClick={()=> handleClickSeatPlaceRoomNumber(2, 2)}
                                    disabled={reservedUsers.some(reserved =>
                                        reserved.seat_number == '2' &&
                                        reserved.block == selectedBlock.charAt(0) &&
                                        reserved.room_number == roomNumbersArray[0]
                                      )}
                                    style={{
                                        backgroundColor: reservedUsers.some(reserved =>
                                          reserved.seat_number == '2' &&
                                          reserved.block == selectedBlock.charAt(0) &&
                                          reserved.room_number == roomNumbersArray[0]
                                        ) ? '#E94949' : selectedSeatID === 2 ? '#F3A367' : '#00A35D'
                                      }}>2</button>
                                    <button className='seat-place'
                                    onClick={()=> handleClickSeatPlaceRoomNumber(1 ,1)}
                                    disabled={reservedUsers.some(reserved =>
                                        reserved.seat_number == '1' &&
                                        reserved.block == selectedBlock.charAt(0) &&
                                        reserved.room_number == roomNumbersArray[0]
                                      )}
                                    style={{
                                        backgroundColor: reservedUsers.some(reserved =>
                                          reserved.seat_number == '1' &&
                                          reserved.block == selectedBlock.charAt(0) &&
                                          reserved.room_number == roomNumbersArray[0]
                                        ) ? '#E94949' : selectedSeatID === 1 ? '#F3A367' : '#00A35D'
                                      }}>1</button>
                                </div>
                            </div>

                            <div className='seat-visual-door'>
                                <div className='seat-door-item'></div>
                                <p>door</p>
                            </div>
                        </div>
                    </div>
                    <div className='btn-confirm-booking'>
                            <div className='btn-back'>
                                <button onClick={()=>{handleClickBack()}}>Back</button>
                            </div>          
                            <div className='btn-confirm-restart'>
                                    <button onClick={()=>{handleOpenModal()}}>Restart</button>
                                    <Modal className='modal' isOpen={isModalOpen} onRequestClose={()=> handleCloseModal()}>
                                        <h3>Do you really cancel the restart?</h3>
                                        <div className='btns-modal'>
                                            <button onClick={()=>{handleCloseModal()}}>No, I will not restart</button>
                                            <button onClick={()=>handleClickRestart()}>Yes, restart</button>
                                        </div>
                                    </Modal>
                                    <button className='btn-confirm' onClick={()=>handleConfirm()}>
                                      Go to Confirm
                                    </button>
                            </div>
                    </div>
                    <div className='btn-booking-colors'>
                            <div className='selected-place-orange'>
                                <div className='orange'></div>
                                <h4>Your book</h4>
                            </div>          
                            <div className='available-seat'>
                                <div className='green'></div>
                                <h4>Available seat</h4>
                            </div>
                            <div className='not-available-seat'>
                                <div className='red'></div>
                                <h4>Not available seat</h4>
                            </div>
                    </div>                 
                </div>)}

            </div>
        </div>
    </main>
  )
}
