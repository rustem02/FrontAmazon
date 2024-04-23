import React, { useContext, useEffect, useState } from 'react'
import Navbar from '../../components/Navbar'
import AuthContext from '../../context/AuthContext'
import {useNavigate} from 'react-router-dom'
import axios from 'axios'

export default function Oops() {
  const oopsMessage = localStorage.getItem('messageDocSubm')
  const { authTokens } =useContext(AuthContext)
  const [userProfile,setUserProfile] = useState('')
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
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
      fetchData();
    },[]);

  return (
    <div className='oops'>
        <Navbar/>
        <div className='oops-container'>
            <div className='oops-img'>
            <img src={require('../../img/oops.png')} alt="oops"/>
            </div>
            <div className='oops-content'>
                <h1 className='oops-title'>Oops! You did wrong!</h1>
                <p className='oops-message'>Sorry, you were wrong! To get access to the booking service, {oopsMessage}</p>
            </div>
            {!userProfile.is_doc_submitted ? (
                <a className='oops-link' to = '/document-submission' onClick={()=>navigate('/document-submission')}>Go to Document Submission page</a>
            ):(
                <a className='oops-link' onClick={()=>navigate('/main-page')}>Go to Main Page</a>
            )}
        </div> 
    </div>
  )
}
