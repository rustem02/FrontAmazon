import React, { useContext, useEffect,useState, useRef } from 'react'
import AuthContext from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios'
import {FaBars, FaTimes} from 'react-icons/fa'
import { useTranslation } from 'react-i18next';

export default function Navbar() {
  const { authTokens, logoutUser } = useContext(AuthContext);
  const { t, i18n } = useTranslation();
  const [name, setName] = useState("");
  const [isStaff, setStaff] = useState("");
  const [role, setRole] = useState("student");
  const navigate = useNavigate();

  const navRef = useRef();

//   const isDisabled = selectedBlock !== null;
  let menu = document.getElementById('burger-menu')
  let userBookedEarlier = JSON.parse(localStorage.getItem('userBookedEarlier'))
  let userProfile = JSON.parse(localStorage.getItem('userProfile'))

  useEffect(() => {
    if (authTokens) {
      const userInfo = authTokens.user
      setName(userInfo.first_name);
      setStaff(userInfo.is_staff) // Предполагая, что email содержится в токене
      setRole(userInfo.role || 'student')
    }
  }, [authTokens]);

  const isAdminLike = isStaff || role === 'admin' || role === 'dorm_staff';

  const onLanguageChange = (event) => {
    const lang = event.target.value;
    i18n.changeLanguage(lang);
    localStorage.setItem('lang', lang);
  };

  const changeBurgerMenu = ()=>{
       menu.classList.toggle('open-menu')
  }

  const showNavbar = ()=>{
        navRef.current.classList.toggle('responsive_nav')
  }
    
  const handleClickBookNow = async ()=> {
      // Выполняем GET запрос
      const getResponse = await axios.get('documents/get/', {
        headers: {
            'Authorization': `Bearer ${authTokens.access}`,
        }
    });

      const res = getResponse.data[0]
      console.log("Documents get: ", res);

      if (userBookedEarlier === ''){
            if (userProfile.is_doc_submitted === false){
                let messageDocSubmissionTxt = 'you must first submit the documents to the Dorm administration!';
                localStorage.setItem('messageDocSubm', messageDocSubmissionTxt)
                navigate('/oops');
            }else{
                    if(res && res.hasOwnProperty('is_verified')){
                        const userDocVerified = res.is_verified
                        if (userDocVerified === true){
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
      }else{
          navigate('/my-booking');
      }
  }

  return (
    <nav className="nav">
        <div className="wrapper navbar-content">
          <div className="logo-nav">
              <a href='/main-page'><img src={require('../img/logo-nav.png')} alt="logo"/></a>
          </div>
          <div className="navbar">
              <ul className="navbar-items">
                  <li><Link to="/main-page">{t('nav.home')}</Link></li>
                  <li><Link to="/rooms">{t('nav.rooms')}</Link></li>
                  <li><button className='nav-link-button' onClick={()=>handleClickBookNow()}>{t('nav.booking')}</button></li>
                  <li><Link to="/payment-booking">{t('nav.payment')}</Link></li>
                  <li><Link to="/support-chat">{t('nav.supportChat')}</Link></li>
                  {isAdminLike ? (
                     <li><Link to="/news-admin">{t('nav.news')}</Link></li>
                  ):(
                    <li><Link to="/news">{t('nav.news')}</Link></li>
                  )}
                  {isAdminLike && <li><Link to="/admin-dashboard">{t('nav.analytics')}</Link></li>}
                  <li><Link to="/about-us">{t('nav.about')}</Link></li>
                  <li>
                    <select onChange={onLanguageChange} value={i18n.language} style={{ borderRadius: '6px', padding: '6px' }}>
                      <option value="en">EN</option>
                      <option value="ru">RU</option>
                      <option value="kz">KZ</option>
                    </select>
                  </li>
              </ul>
              <ul className="burger-navbar-items" ref={navRef}>
                  <li><Link to="/main-page">{t('nav.home')}</Link></li>
                  <li><Link to="/rooms">{t('nav.rooms')}</Link></li>
                  <li><button className='nav-link-button' onClick={()=>handleClickBookNow()}>{t('nav.booking')}</button></li>
                  <li><Link to="/payment-booking">{t('nav.payment')}</Link></li>
                  <li><Link to="/support-chat">{t('nav.supportChat')}</Link></li>
                  {isAdminLike ? (
                     <li><Link to="/news-admin">{t('nav.news')}</Link></li>
                  ):(
                    <li><Link to="/news">{t('nav.news')}</Link></li>
                  )}
                  {isAdminLike && <li><Link to="/admin-dashboard">{t('nav.analytics')}</Link></li>}
                  <li><Link to="/about-us">{t('nav.about')}</Link></li>
                  <li>
                    <select onChange={onLanguageChange} value={i18n.language} style={{ borderRadius: '6px', padding: '6px' }}>
                      <option value="en">EN</option>
                      <option value="ru">RU</option>
                      <option value="kz">KZ</option>
                    </select>
                  </li>
                  <button onClick={showNavbar} className='cancel-burger-btn'>
                        <FaTimes/>
                  </button>
              </ul>
              <ul className='navbar-icons'> 
                  <li className="nav-icons">
                      <button className="nav-btn">
                          <svg width="23" height="25" viewBox="0 0 23 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M11.5 25C13.2246 25 14.6236 23.6011 14.6236 21.875H8.3765C8.3765 23.6011 9.77542 25 11.5 25ZM22.0171 17.6899C21.0738 16.6763 19.3086 15.1514 19.3086 10.1562C19.3086 6.3623 16.6485 3.3252 13.0616 2.58008V1.5625C13.0616 0.699707 12.3623 0 11.5 0C10.6377 0 9.93851 0.699707 9.93851 1.5625V2.58008C6.3516 3.3252 3.69144 6.3623 3.69144 10.1562C3.69144 15.1514 1.9263 16.6763 0.982944 17.6899C0.689975 18.0049 0.560092 18.3813 0.562534 18.75C0.567905 19.5508 1.19632 20.3125 2.12992 20.3125H20.8702C21.8037 20.3125 22.4327 19.5508 22.4375 18.75C22.44 18.3813 22.3101 18.0044 22.0171 17.6899Z" fill="#F5F5F5" fill-opacity="0.6"/>
                          </svg>
                      </button>
                      <button className="nav-btn" onClick={changeBurgerMenu}>
                          <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M12.5 14.0625C16.3818 14.0625 19.5312 10.9131 19.5312 7.03125C19.5312 3.14941 16.3818 0 12.5 0C8.61816 0 5.46875 3.14941 5.46875 7.03125C5.46875 10.9131 8.61816 14.0625 12.5 14.0625ZM18.75 15.625H16.0596C14.9756 16.123 13.7695 16.4062 12.5 16.4062C11.2305 16.4062 10.0293 16.123 8.94043 15.625H6.25C2.79785 15.625 0 18.4229 0 21.875V22.6562C0 23.9502 1.0498 25 2.34375 25H22.6562C23.9502 25 25 23.9502 25 22.6562V21.875C25 18.4229 22.2021 15.625 18.75 15.625Z" fill="#F5F5F5" fill-opacity="0.6"/>
                          </svg>
                      </button>
                      <button onClick={showNavbar} className='burger-btn'>
                            <FaBars className='burger-icon'/>
                      </button>  
                      <div id="burger-menu">
                      {isAdminLike ? (
                            <div className="menu-item">
                                <p>{t('nav.adminPanel')}</p>
                            </div>
                        ):(
                            <div className="menu-item">
                                <p>{name}</p>
                            </div>
                        )}
                        {isAdminLike ? (
                            <div className="menu-item">
                                <Link to='/admin-dashboard'>{t('nav.systemAnalytics')}</Link>
                            </div>
                        ):(
                            <div className="menu-item">
                                <Link to='/profile'>{t('nav.profile')}</Link>
                            </div>
                        )}
                        <div className="menu-item">
                            <Link to="/my-booking"><p>{t('nav.bookingHistory')}</p></Link>
                        </div>
                        {isAdminLike && (
                            <div className="menu-item">
                                <Link to="/verify-documents"><p>{t('nav.verifyDocs')}</p></Link>
                            </div>
                        )}
                        <div className="menu-item">
                             <Link to="/support-chat"><p>{t('nav.supportChat')}</p></Link>
                        </div>
                        <div className="menu-item" onClick={logoutUser}>
                            <p>{t('nav.signOut')}</p>
                        </div>
                      </div>                         
                  </li>
              </ul>
          </div>
      </div>
    </nav>
  )
}
