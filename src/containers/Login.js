import React from 'react'
import { Link } from 'react-router-dom';
import { useContext } from 'react';
import AuthContext from '../context/AuthContext';
import { useTranslation } from 'react-i18next';

const Login = ()=> {

  let {loginUser, errorLogin, setErrorLogin} = useContext(AuthContext)
  const { t } = useTranslation();

  //Если пользователь авторизовался то кидать на MainPage
  return (
    <main>
        <div className='signing'>
            <div className='container'>
                <div className='logo'>
                    <img src={require('../img/logoDorm.png')} alt={'logo'} />
                </div>
                <div className="form-content">
                    <div className="title-content">
                        <h2>{t('login.signIn')}</h2>
                        <p>{t('login.welcomeBack')}</p>
                    </div>
                    <form onSubmit={loginUser}>
                      <div className="field-component">
                        <label htmlFor="email">{t('login.email')}</label>
                        <input 
                        type="email" 
                        id="email"
                        name="email"
                        // autoComplete='off'
                        // onChange={e => setEmail(e.target.value)}
                        // value={email}
                        required
                        placeholder="Enter the email" 
                        />
                      </div>
                      <div className="field-component field-login">
                        <label htmlFor="password">{t('login.password')}</label>
                        <input 
                        type="password" 
                        id="password"
                        required
                        placeholder="Enter the password" 
                        style={{ outlineColor: errorLogin ? '#E94949' : ''}}
                        />
                        <p className='errorLogin'>{errorLogin ? errorLogin: ''}</p>
                      </div>
                      <div className="additional">
                         <div className="remember-chkbx">
                          <input 
                            type="checkbox" 
                            name="remember" 
                            id="remember" 
                          />
                         <label>{t('login.remember')}</label>
                        </div>
                        <div className="forgot">
                          <a href="/"><Link to='/reset-password'>{t('login.forgotPassword')}</Link></a>
                        </div>
                      </div>
                      <button className="btn">{t('login.signIn')}</button>
                    </form>
                </div>
                <h4>{t('login.noAccount')} <Link to ='/register' onClick={()=>setErrorLogin('')}>{t('login.clickHere')}</Link></h4>
            </div>
        </div>
        <div className="welcome">
            <div className="welcome-items">
                <div className="img">
                    <img src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=900&q=80" alt={"img"} />
                </div>
                <div className="welcome-content">
                    <h2 className="welcome-title">Welcome to Dorm Hub platform!</h2>
                    <p className="welcome-desc">Dorm Hub Kazakhstan is a digital platform that helps students from universities across Kazakhstan book dormitory places in a transparent way.</p>
                </div>
            </div>
        </div>
    </main>
    );
  };

// const mapStateToProps = state =>({
//   //Авторизовался?
// });

export default Login;
    // </>
  // )
// }
