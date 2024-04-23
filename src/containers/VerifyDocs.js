import React, { useContext, useEffect,useState } from 'react'
import axios from 'axios'
import AuthContext from '../context/AuthContext';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';


export default function VerifyDocs() {
    const {authTokens} = useContext(AuthContext)
    const [documents, setDocuments] = useState([]);
    const [verified,setVerified] = useState("")

    const handleClickSearch = () =>{

    }

    const handleReload = () =>{
        window.location.reload()
    }

    useEffect(()=>{
        const fetchDocuments = async() =>{
            try{
                const response = axios.get('documents/',{
                    headers: {
                        Authorization: `Bearer ${authTokens.access}` // Добавляем токен для аутентификации запроса
                      }
                })

                const res = (await response).data;
                const responseRes = res.reverse()

                setDocuments(responseRes);

                // Создаем массив только с верифицированными пользователями
                const verifiedUsers = res.filter(doc => doc.is_verified).map(doc => doc.user_data.email);

                setVerified(verifiedUsers); // Сохраняем массив верифицированных пользователей
                console.log(verified);
            }catch(err){
                console.error('Ошибка при получении списка документов:', err);
            }
        }
        fetchDocuments()
    },[authTokens]);

    // В другом месте вашего компонента (или в другом useEffect)
    useEffect(() => {
        if (verified.length > 0) {
            console.log('Верифицированные пользователи:', verified);
        }
    }, [verified]);
    
    return (
    <>
        <Navbar/>
        <div className='verify-document'>
            <h3>Verify Document</h3>
            <div className='document-container'>
                <div className='document-header'>
                    <button className='btn-update' onClick={()=>handleReload()}><img src={require('../img/reset.png')} alt="reset"/>Update Page</button>
                    <button className='btn-search' onClick={()=>handleClickSearch()}></button>
                </div>
                <div className='documents-list'>
                    {documents.map((doc,index) => (
                    <div key={index} className='documents-item'>
                        <div style={{ color: verified.includes(doc.user_data.email) ? '#212153' : '#21215399' }}>
                            {doc.user_data.email}
                        </div>

                        <div className='detailed-verify'>
                            <div className='indicator' style={{backgroundColor: verified.includes(doc.user_data.email) ? '#00A35D' : '#F3A367' }}></div>
                            <Link 
                            to = {{ pathname: `/detailed-doc/${doc.user_data.email}` }}>
                                <a>detailed &gt;</a>
                            </Link>
                        </div>
                    </div> // Пример отображения документов
                    ))}
                </div>
            </div>
        </div>
    </>
  )
}
