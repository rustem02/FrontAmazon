import React, { useContext, useEffect, useState }  from 'react'
import Navbar from '../components/Navbar'
import { useNavigate } from 'react-router-dom'
import AuthContext from '../context/AuthContext'
import axios from 'axios'
import { useTranslation } from 'react-i18next';

export default function MainPage() {
    const { authTokens } = useContext(AuthContext)
    const { t } = useTranslation();

    const [userBookedEarlier, setUserBookedEarlier] = useState('')
    const [userProfile, setUserProfile] = useState('')

    const navigate = useNavigate();
    const hasActiveBooking = Array.isArray(userBookedEarlier) && userBookedEarlier.length > 0;

    const handleClickBookNow = async ()=> {
        const response = await axios.get('documents/get/', {
            headers: {
                'Authorization': `Bearer ${authTokens.access}`,
            }
        });
        
        const res = response.data[0]
        console.log("Doc is submitted: ", userProfile.is_doc_submitted);

        if (userProfile.is_doc_submitted === false) {
            let messageDocSubmissionTxt = 'you must first submit the documents to the Dorm administration!';
            localStorage.setItem('messageDocSubm', messageDocSubmissionTxt)
            navigate('/oops');
        }else{
            if(res && res.hasOwnProperty('is_verified')){
                const userDocVerified = res.is_verified;
                if (userDocVerified === true) {
                    navigate('/booking') 
                }else{
                    let messageDocSubmissionTxt = 'the Dorm administration must verify your documents';
                    localStorage.setItem('messageDocSubm', messageDocSubmissionTxt)
                    navigate('/oops');
                }
            }else{
                console.log('Ключ is_verified отсутствует или массив пуст.');
            }
        }

    }

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
                setUserBookedEarlier(res)
                console.log("Пользователь забронировал: ", res);
            } catch (error) {
                // Обработка ошибок
                console.error('Error fetching data:', error);
            }
        };

        fetchData(); // Вызов функции для выполнения запроса при загрузке компонента
    }, [authTokens]);
    localStorage.setItem('userBookedEarlier', JSON.stringify(userBookedEarlier))

    useEffect(() => {
        const fetchProfile = async ()=> {
            try {
                // Выполняем GET запрос с задержкой 3 секунды
                const getResponse = await axios.get('profile/', {
                    headers: {
                        'Authorization': `Bearer ${authTokens.access}`,
                    }
                });
    
                const res = getResponse.data
                setUserProfile(res)
    
                console.log("Данные профиля: ", res);
            } catch (error) {
                console.error("Ошибка при выполнении GET запроса:", error);
            }
        }
        fetchProfile();
    }, [authTokens]);
    localStorage.setItem('userProfile', JSON.stringify(userProfile))

  return (
    <div className='main-page'>
        <Navbar/>
        <section className="wrapper">
            <header className='header'>
                <div className="title-main">
                    <h1>{t('main.title')}</h1>
                    <p>This platform is designed for dormitory placement across universities in Kazakhstan. Students can submit documents, track verification, book a bed, and complete payment in one transparent digital flow.</p>
                    <div className="btn-group">
                        <>
                            {hasActiveBooking ? (
                                <button className="btn-book" onClick={()=>navigate('/my-booking')}>{t('main.myBookings')}</button>
                            ):(
                                <button className="btn-book" onClick={()=>handleClickBookNow()}>{t('main.bookNow')}</button>
                            )}

                            {hasActiveBooking && (
                                <button className="btn-submission" onClick={()=>navigate('/payment-booking')}>
                                    {t('main.paymentPage')}
                                </button>
                            )}

                            {!hasActiveBooking && (
                                <button className="btn-submission" onClick={()=>navigate('/booking')}>
                                    {t('main.openBooking')}
                                </button>
                            )}

                            <button className="btn-submission" onClick={()=>navigate('/support-chat')}>
                                {t('main.supportChat')}
                            </button>

                            {userProfile.is_doc_submitted === true ? (
                                <button className="btn-submission" onClick={()=>navigate('/update-submission')}>{t('main.updateSubmission')}</button>
                            ):(
                                <button className="btn-submission" onClick={()=>navigate('/document-submission')}>{t('main.documentSubmission')}</button>
                            )}
                        </>
                    </div>
                </div>
                <div className="dorm-img">
                    <img src="https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=1200&q=80" alt="University dormitory"/>
                </div>
            </header>
        </section>

        <section className='wrapper quick-actions-section'>
            <h2>{t('main.quickActionsTitle')}</h2>
            <p>{t('main.quickActionsDesc')}</p>
            <div className='quick-actions-grid'>
              <button className='quick-action-card' onClick={handleClickBookNow}>
                <h3>{t('main.bookNow')}</h3>
                <p>{t('main.quickBookDesc')}</p>
              </button>
              <button className='quick-action-card' onClick={() => navigate('/my-booking')}>
                <h3>{t('main.myBookings')}</h3>
                <p>{t('main.quickMyBookingDesc')}</p>
              </button>
              <button
                className='quick-action-card'
                onClick={() => navigate('/payment-booking')}
                disabled={!hasActiveBooking}
                title={!hasActiveBooking ? t('main.paymentDisabledHint') : ''}
              >
                <h3>{t('main.paymentPage')}</h3>
                <p>{hasActiveBooking ? t('main.quickPaymentDesc') : t('main.paymentDisabledHint')}</p>
              </button>
              <button className='quick-action-card' onClick={() => navigate('/support-chat')}>
                <h3>{t('main.supportChat')}</h3>
                <p>{t('main.quickChatDesc')}</p>
              </button>
              <button className='quick-action-card' onClick={() => navigate('/document-submission')}>
                <h3>{t('main.documentSubmission')}</h3>
                <p>{t('main.quickDocsDesc')}</p>
              </button>
            </div>
        </section>
        <section className="main-points">
            <h2>{t('main.points')}</h2>
            <div className='main-points-container'>
                <div class="vision">
                    <div className='vision-circle'></div>
                    <h3>Vision</h3>
                    <p>Transforming dormitory services into a convenient and transparent system for all students in Kazakhstan.</p>
                </div>
                <div class="mission">
                    <div className='mission-circle'></div>
                    <h3>Mission</h3>
                    <p>Facilitating a smooth process, improving interaction and communication with students.</p>
                </div>
                <div class="goal">
                    <div className='goal-circle'></div>
                    <h3>Goal</h3>
                    <p>Streamlining accommodation booking for first-year students through a user-friendly platform.</p>
                </div>
            </div>
        </section>
        <section className='instructional-videos'>
            <h2>Instructional video of using the platform</h2>
            <div className='docSubmissin-instructional instruction-videos-item'>
                <div className='docSubmissin-instructional-content'>
                    <div>
                        <h2>Document Submission</h2>
                        <p>This is instructional video of submission of the document. By watching this video, you will learn how to submit documents correctly and in full on our platform.Watch the video carefully and repeat with us. Good luck!</p>
                        <button type='button'>
                            <svg width="29" height="29" viewBox="0 0 29 29" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M14.5 1.8125C17.8649 1.8125 21.092 3.14921 23.4714 5.52858C25.8508 7.90795 27.1875 11.1351 27.1875 14.5C27.1875 17.8649 25.8508 21.092 23.4714 23.4714C21.092 25.8508 17.8649 27.1875 14.5 27.1875C11.1351 27.1875 7.90795 25.8508 5.52858 23.4714C3.14921 21.092 1.8125 17.8649 1.8125 14.5C1.8125 11.1351 3.14921 7.90795 5.52858 5.52858C7.90795 3.14921 11.1351 1.8125 14.5 1.8125ZM14.5 25.375C17.3842 25.375 20.1503 24.2292 22.1898 22.1898C24.2292 20.1503 25.375 17.3842 25.375 14.5C25.375 11.6158 24.2292 8.84967 22.1898 6.81021C20.1503 4.77076 17.3842 3.625 14.5 3.625C11.6158 3.625 8.84967 4.77076 6.81021 6.81021C4.77076 8.84967 3.625 11.6158 3.625 14.5C3.625 17.3842 4.77076 20.1503 6.81021 22.1898C8.84967 24.2292 11.6158 25.375 14.5 25.375ZM13.1406 18.3624L18.9352 14.5L13.1406 10.6376V18.3624ZM13.4415 8.65831L20.5066 13.369C20.6928 13.4931 20.8455 13.6613 20.951 13.8586C21.0566 14.0559 21.1119 14.2762 21.1119 14.5C21.1119 14.7238 21.0566 14.9441 20.951 15.1414C20.8455 15.3387 20.6928 15.5069 20.5066 15.631L13.4415 20.3417C13.2368 20.4782 12.9989 20.5565 12.7531 20.5684C12.5074 20.5803 12.263 20.5252 12.0461 20.4091C11.8292 20.293 11.6478 20.1203 11.5214 19.9092C11.3949 19.6981 11.3281 19.4567 11.3281 19.2107V9.7875C11.3281 9.54147 11.3949 9.30005 11.5214 9.08899C11.6478 8.87794 11.8292 8.70515 12.0461 8.58906C12.263 8.47297 12.5074 8.41793 12.7531 8.42981C12.9989 8.44169 13.2368 8.52003 13.4415 8.6565V8.65831Z" fill="white"/>
                            </svg>
                            Watch the video
                        </button>
                    </div>
                </div>
                <div className='docSubmissin-instructional-img'>
                    <img src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=900&q=80"  alt="Document submission tutorial"/>
                </div>
            </div>
            <div className='docSubmissin-instructional instruction-videos-item'>
                <div className='docSubmissin-instructional-img instructional-img-left'>
                    <img src="https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=900&q=80"  alt="Booking tutorial"/>
                </div>
                <div className='docSubmissin-instructional-content docSubmissin-instructional-content-right'>
                    <div className='content-right'>
                        <h2>Make a Booking</h2>
                        <p>This is instructional video of make a booking. By watching this video, you will learn how to make a booking easily and correctly on our platform.Watch the video carefully and repeat with us. Good luck!</p>
                        <button type='button'>
                            <svg width="29" height="29" viewBox="0 0 29 29" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M14.5 1.8125C17.8649 1.8125 21.092 3.14921 23.4714 5.52858C25.8508 7.90795 27.1875 11.1351 27.1875 14.5C27.1875 17.8649 25.8508 21.092 23.4714 23.4714C21.092 25.8508 17.8649 27.1875 14.5 27.1875C11.1351 27.1875 7.90795 25.8508 5.52858 23.4714C3.14921 21.092 1.8125 17.8649 1.8125 14.5C1.8125 11.1351 3.14921 7.90795 5.52858 5.52858C7.90795 3.14921 11.1351 1.8125 14.5 1.8125ZM14.5 25.375C17.3842 25.375 20.1503 24.2292 22.1898 22.1898C24.2292 20.1503 25.375 17.3842 25.375 14.5C25.375 11.6158 24.2292 8.84967 22.1898 6.81021C20.1503 4.77076 17.3842 3.625 14.5 3.625C11.6158 3.625 8.84967 4.77076 6.81021 6.81021C4.77076 8.84967 3.625 11.6158 3.625 14.5C3.625 17.3842 4.77076 20.1503 6.81021 22.1898C8.84967 24.2292 11.6158 25.375 14.5 25.375ZM13.1406 18.3624L18.9352 14.5L13.1406 10.6376V18.3624ZM13.4415 8.65831L20.5066 13.369C20.6928 13.4931 20.8455 13.6613 20.951 13.8586C21.0566 14.0559 21.1119 14.2762 21.1119 14.5C21.1119 14.7238 21.0566 14.9441 20.951 15.1414C20.8455 15.3387 20.6928 15.5069 20.5066 15.631L13.4415 20.3417C13.2368 20.4782 12.9989 20.5565 12.7531 20.5684C12.5074 20.5803 12.263 20.5252 12.0461 20.4091C11.8292 20.293 11.6478 20.1203 11.5214 19.9092C11.3949 19.6981 11.3281 19.4567 11.3281 19.2107V9.7875C11.3281 9.54147 11.3949 9.30005 11.5214 9.08899C11.6478 8.87794 11.8292 8.70515 12.0461 8.58906C12.263 8.47297 12.5074 8.41793 12.7531 8.42981C12.9989 8.44169 13.2368 8.52003 13.4415 8.6565V8.65831Z" fill="white"/>
                            </svg>
                            Watch the video
                        </button>
                    </div>
                </div>
            </div>
        </section>
        <footer className='footer'>
             <div className='footer-header'>
                <div className='footer-logo footer-header-item'>
                    <img src={require('../img/logo-nav.png')}  alt="footer-logo"/>
                </div>
                <div className='footer-team-name footer-header-item'>
                    <p>© 2024 Vision Team</p>
                </div>
                <div className='footer-icons footer-header-item'>
                    <img src={require('../img/icons/icon-x.png')}  alt="footer-icon1"/>
                    <img src={require('../img/icons/icon-insta.png')}  alt="footer-icon2"/>
                    <img src={require('../img/icons/icon-facebook.png')}  alt="footer-icon3"/>
                </div>
             </div>
             <div className='footer-content'>
                <div className='footer-item'>
                    <h5>Dormitory administration support:</h5>
                    <p>support@dormhub.kz</p>
                    <p>(hotline) +7 700 000 0000</p>
                </div>
                <div className='footer-item'>
                    <h5>Reception/ plumbing services</h5>
                    <p>(mob.) +7 778 727 9567</p>
                    <p>(tel.) +7 727 307 9560 (int. 704)</p>
                </div>
                <div className='footer-item'>
                    <h5>Security and Medical care:</h5>
                    <p>(tel.) +7 727 307 9560 (int. 199 /197) | Security</p>
                    <p>(mob.) +7 778 997 5839 | Medical care</p>
                </div>
             </div>             
        </footer>
  </div>

  )
}
