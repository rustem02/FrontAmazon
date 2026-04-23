import React, { useContext, useEffect, useMemo, useState } from 'react';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import axios from 'axios';

export default function Booking() {
  const navigate = useNavigate();
  const { authTokens } = useContext(AuthContext);

  const [universities, setUniversities] = useState([]);
  const [dormitories, setDormitories] = useState([]);
  const [seats, setSeats] = useState([]);
  const [layoutBlocks, setLayoutBlocks] = useState([]);
  const [loadingSeats, setLoadingSeats] = useState(false);
  const [bookingError, setBookingError] = useState('');
  const [loadingLayout, setLoadingLayout] = useState(false);

  const [selectedUniversity, setSelectedUniversity] = useState('');
  const [selectedDormitory, setSelectedDormitory] = useState('');
  const [selectedBlock, setSelectedBlock] = useState('');
  const [selectedFloor, setSelectedFloor] = useState('');
  const [selectedRoomNumber, setSelectedRoomNumber] = useState('');
  const [selectedSemester, setSelectedSemester] = useState('');
  const [selectedSeat, setSelectedSeat] = useState(null);

  useEffect(() => {
    const fetchUniversities = async () => {
      try {
        const response = await axios.get('universities/');
        setUniversities(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error('Cannot fetch universities:', error);
      }
    };
    fetchUniversities();
  }, []);

  useEffect(() => {
    if (!selectedUniversity) {
      setDormitories([]);
      setSelectedDormitory('');
      setLayoutBlocks([]);
      setSelectedBlock('');
      return;
    }
    const fetchDormitories = async () => {
      try {
        const response = await axios.get(`dormitories/?university_id=${selectedUniversity}`);
        setDormitories(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error('Cannot fetch dormitories:', error);
      }
    };
    fetchDormitories();
  }, [selectedUniversity]);

  useEffect(() => {
    if (!selectedDormitory) {
      setLayoutBlocks([]);
      setSelectedBlock('');
      setSelectedFloor('');
      setSelectedRoomNumber('');
      setSeats([]);
      return;
    }

    const fetchLayout = async () => {
      setLoadingLayout(true);
      setBookingError('');
      try {
        const response = await axios.get(
          `booking/layout/?dormitory_id=${selectedDormitory}&university_id=${selectedUniversity}`,
          { headers: { Authorization: `Bearer ${authTokens.access}` } }
        );
        const blocks = Array.isArray(response.data?.blocks) ? response.data.blocks : [];
        setLayoutBlocks(blocks);
        if (!blocks.some((item) => item.block === selectedBlock)) {
          setSelectedBlock(blocks[0]?.block || '');
        }
      } catch (error) {
        setLayoutBlocks([]);
        setSelectedBlock('');
        setBookingError(error?.response?.data?.error || 'Unable to load dormitory structure.');
      } finally {
        setLoadingLayout(false);
      }
    };

    fetchLayout();
  }, [authTokens, selectedDormitory, selectedUniversity, selectedBlock]);

  useEffect(() => {
    if (!selectedUniversity || !selectedDormitory || !selectedBlock) {
      setSeats([]);
      return;
    }
    const fetchSeats = async () => {
      setLoadingSeats(true);
      setBookingError('');
      try {
        const query = new URLSearchParams({
          university_id: String(selectedUniversity),
          dormitory_id: String(selectedDormitory),
          block: selectedBlock,
        });
        if (selectedRoomNumber) query.append('room_number', selectedRoomNumber);

        const response = await axios.get(`available-seats/?${query.toString()}`, {
          headers: { Authorization: `Bearer ${authTokens.access}` },
        });
        setSeats(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        setBookingError(error?.response?.data?.error || 'Unable to load available seats.');
      } finally {
        setLoadingSeats(false);
      }
    };
    fetchSeats();
  }, [authTokens, selectedUniversity, selectedDormitory, selectedBlock, selectedRoomNumber]);

  const selectedBlockLayout = useMemo(
    () => layoutBlocks.find((item) => item.block === selectedBlock) || null,
    [layoutBlocks, selectedBlock]
  );
  const selectedDormitoryData = useMemo(
    () => dormitories.find((item) => String(item.id) === String(selectedDormitory)) || null,
    [dormitories, selectedDormitory]
  );

  const floorOptions = useMemo(() => selectedBlockLayout?.floors || [], [selectedBlockLayout]);

  const roomOptions = useMemo(() => {
    const rooms = selectedBlockLayout?.rooms || [];
    const filtered = selectedFloor
      ? rooms.filter((room) => String(room.floor) === String(selectedFloor))
      : rooms;
    return filtered.map((room) => room.room_number).sort((a, b) => Number(a) - Number(b));
  }, [selectedBlockLayout, selectedFloor]);

  const groupedSeats = useMemo(() => {
    return seats.reduce((acc, seat) => {
      const room = seat.room_number;
      if (!acc[room]) acc[room] = [];
      acc[room].push(seat);
      return acc;
    }, {});
  }, [seats]);

  const goToConfirmation = () => {
    if (!selectedSeat || !selectedSemester) {
      setBookingError('Please choose semester and seat.');
      return;
    }
    const pricePerSemester = Number(selectedDormitoryData?.price_per_semester || 195000);
    const totalAmount = pricePerSemester * Number(selectedSemester || 1);
    const draft = {
      university_id: selectedUniversity,
      dormitory_id: selectedDormitory,
      dormitory_name: selectedDormitoryData?.name || '',
      block: selectedSeat.block,
      room_number: String(selectedSeat.room_number),
      seat_number: selectedSeat.seat_number,
      semester_duration: Number(selectedSemester),
      price_per_semester: pricePerSemester,
      amount: totalAmount,
      image_url: selectedDormitoryData?.image_url || '',
      room_image_url: selectedDormitoryData?.room_image_url || '',
    };
    localStorage.setItem('bookingDraft', JSON.stringify(draft));
    navigate('/confirmation-booking');
  };

  return (
    <main className='booking'>
      <Navbar />
      <div className='wrapper booking-content'>
        <div className='booking-system'>
          <div>
            <img src={require('../img/logoDorm.png')} alt="booking-logo" />
            <h2>Booking</h2>
            <p className='txt'>
              Select university, dormitory, block, semester and available seat to continue.
            </p>

            <div className='selection-group'>
              <div className='floor-selection'>
                <select value={selectedUniversity} onChange={(event) => setSelectedUniversity(event.target.value)}>
                  <option value="">Select university</option>
                  {universities.map((university) => (
                    <option key={university.id} value={university.id}>
                      {university.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className='corridor-selection'>
                <select
                  value={selectedDormitory}
                  onChange={(event) => {
                    setSelectedDormitory(event.target.value);
                    setSelectedBlock('');
                    setSelectedFloor('');
                    setSelectedRoomNumber('');
                    setSelectedSeat(null);
                  }}
                  disabled={!selectedUniversity}
                >
                  <option value="">Select dormitory</option>
                  {dormitories.map((dormitory) => (
                    <option key={dormitory.id} value={dormitory.id}>
                      {dormitory.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            {selectedDormitoryData && (
              <div style={{ marginTop: '14px', marginBottom: '8px' }}>
                <p>
                  Dormitory price per semester: {Number(selectedDormitoryData.price_per_semester || 0).toLocaleString('ru-RU')} ₸
                </p>
                <div style={{ display: 'flex', gap: '12px', marginTop: '8px', flexWrap: 'wrap' }}>
                  {selectedDormitoryData.image_url && (
                    <img
                      src={selectedDormitoryData.image_url}
                      alt={`${selectedDormitoryData.name} exterior`}
                      style={{ width: '180px', height: '120px', objectFit: 'cover', borderRadius: '10px' }}
                    />
                  )}
                  {selectedDormitoryData.room_image_url && (
                    <img
                      src={selectedDormitoryData.room_image_url}
                      alt={`${selectedDormitoryData.name} room`}
                      style={{ width: '180px', height: '120px', objectFit: 'cover', borderRadius: '10px' }}
                    />
                  )}
                </div>
              </div>
            )}

            <div className='btn-group'>
              {layoutBlocks.map((blockInfo) => (
                <button
                  key={blockInfo.block}
                  className={`block ${selectedBlock === blockInfo.block ? 'selected' : ''}`}
                  onClick={() => {
                    setSelectedBlock(blockInfo.block);
                    setSelectedFloor('');
                    setSelectedRoomNumber('');
                    setSelectedSeat(null);
                  }}
                >
                  {blockInfo.block}-block
                </button>
              ))}
            </div>
            {!loadingLayout && selectedDormitory && layoutBlocks.length === 0 && (
              <p>No booking blocks configured for this dormitory yet.</p>
            )}
            {selectedBlockLayout && (
              <p style={{ marginTop: '8px' }}>
                Available in block {selectedBlockLayout.block}: {selectedBlockLayout.available_seats} / {selectedBlockLayout.total_seats}
              </p>
            )}

            <div className='selection-group'>
              <div className='corridor-selection'>
                <select
                  value={selectedFloor}
                  onChange={(event) => {
                    setSelectedFloor(event.target.value);
                    setSelectedRoomNumber('');
                    setSelectedSeat(null);
                  }}
                  disabled={!selectedBlock || floorOptions.length === 0}
                >
                  <option value="">All floors</option>
                  {floorOptions.map((floor) => (
                    <option key={floor} value={floor}>
                      Floor {floor}
                    </option>
                  ))}
                </select>
              </div>
              <div className='corridor-selection'>
                <select value={selectedSemester} onChange={(event) => setSelectedSemester(event.target.value)}>
                  <option value="">Select semester</option>
                  <option value="1">1 semester</option>
                  <option value="2">2 semesters</option>
                </select>
              </div>
              <div className='corridor-selection'>
                <select
                  value={selectedRoomNumber}
                  onChange={(event) => {
                    setSelectedRoomNumber(event.target.value);
                    setSelectedSeat(null);
                  }}
                  disabled={roomOptions.length === 0}
                >
                  <option value="">All rooms</option>
                  {roomOptions.map((room) => (
                    <option key={room} value={room}>
                      Room {room}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {loadingLayout && <p>Loading block, floor and room structure...</p>}
            {loadingSeats && <p>Loading available seats...</p>}
            {!loadingSeats && !loadingLayout && selectedBlock && Object.keys(groupedSeats).length === 0 && (
              <p>No available seats found for this filter.</p>
            )}

            {!loadingSeats && Object.keys(groupedSeats).length > 0 && (
              <div style={{ marginTop: '20px', textAlign: 'left' }}>
                {Object.keys(groupedSeats).sort((a, b) => Number(a) - Number(b)).map((room) => (
                  <div key={room} style={{ marginBottom: '16px', border: '1px solid #d9d9d9', borderRadius: '8px', padding: '10px 12px' }}>
                    <h4 style={{ marginBottom: '8px' }}>Room {room}</h4>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                      {groupedSeats[room].map((seat) => (
                        <button
                          key={seat.id}
                          onClick={() => setSelectedSeat(seat)}
                          className='seat-place'
                          style={{
                            backgroundColor: selectedSeat?.id === seat.id ? '#F3A367' : '#00A35D',
                          }}
                        >
                          Seat {seat.seat_number}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {bookingError && <p style={{ marginTop: '10px', color: '#E94949' }}>{bookingError}</p>}

            <div className='btn-confirm-booking' style={{ marginTop: '20px' }}>
              <div className='btn-confirm-restart'>
                <button onClick={() => {
                  setSelectedSeat(null);
                  setSelectedRoomNumber('');
                  setSeats([]);
                }}>
                  Restart
                </button>
                <button className='btn-confirm' onClick={goToConfirmation}>
                  Go to Confirm
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
