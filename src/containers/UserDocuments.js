import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import AuthContext from '../context/AuthContext';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';

export default function UserDocuments() {
    const { email } = useParams();
    const {authTokens } = useContext(AuthContext)
    const [userDocuments, setUserDocuments] = useState([]);
    const [userVerifiedOrNot, setUserVerifiedOrNot] = useState("");
    const [facultyOfStudent, setFacultyOfStudent] = useState("");
    const [IdNumberOfStudent, setIdNumberOfStudent] = useState("");
    const [userName, setUserName] = useState("");
    const navigate = useNavigate()

    useEffect(()=>{
            const fetchDocuments = async() =>{
                try{
                    const response = await axios.get(`user-documents/?email=${email}`,{
                        headers:{
                            'Authorization': `Bearer ${authTokens.access}`,
                        }
                    })
    
                    const res = (await response).data;
                    
                    setUserDocuments(res);
                    setIdNumberOfStudent(res.user.id_number)
                    setFacultyOfStudent(res.user.faculty_name)
                    setUserName(res.user.first_name)
                    setUserVerifiedOrNot(res.is_verified)
                    console.log(res);
                    console.log("Result this person verified or not: " + res.is_verified);
    
                }catch(err){
                    console.error('Ошибка при получении документов пользователя:', err);
                }
            }
            if(email){
                fetchDocuments()
            }
    },[email]);

    const verifyUser = async () => {
        try {
             await axios.put(`documents/verify/?email=${email}`, {
                is_verified: true
            }, {
                headers: {
                    'Authorization': `Bearer ${authTokens.access}`,
                }
            });
            // Обнови состояние, чтобы отразить, что пользователь верифицирован
            setUserVerifiedOrNot(true);
            console.log("Пользователь верифицирован:", userDocuments.user.first_name);
        } catch (err) {
            console.error('Ошибка при верификации пользователя:', err);
        }
    }

    const cancelVerifyUser = async () => {
        try {
            axios.put(`documents/verify/?email=${email}`, {
                is_verified: false
            }, {
                headers: {
                    'Authorization': `Bearer ${authTokens.access}`,
                }
            });
            // Обнови состояние, чтобы отразить, что пользователь верифицирован
            setUserVerifiedOrNot(false);
            console.log("Пользователь убран с верифицированности:", userDocuments.user.first_name);
        } catch (err) {
            console.error('Ошибка при убратии с верификации пользователя:', err);
        }
    }

    const handleBack = ()=>{
        navigate('/verify-documents')
    }    

    return (
    <div id="view-details">
        <Navbar/>
        <div className='view-doc-details'>
            <h1>View Details</h1>
            <button className='btn-update' onClick={()=>handleBack()}><img src={require('../img/go-back.png')} alt="back"/>Go Back</button>
            <div className='info-of-student'>
                <h2>{userName}</h2>
                <p className='stud-id-txt'>Student ID: {IdNumberOfStudent}</p>
                <p>Faculty: {facultyOfStudent}</p>
            </div>
            <div className='user-documents-content'>
                <div>
                    <h3>{userName} sent these documents for verification:</h3>
                </div>
                <div className='user-documents'>
                    <div className='user-docs-item'>
                        <p>Form-075</p>
                        <img src={userDocuments.form_075} alt="dorm"/>
                    </div>
                    <div className='user-docs-item'>
                        <p>Identity Card Copy</p>
                        <img src={userDocuments.identity_card_copy} alt="dorm"/>
                    </div>
                    <div className='user-docs-item'>
                        <p>Photo 3x4</p>
                        <img src={userDocuments.photo_3x4} alt="dorm"/>
                    </div>
                    <div className='user-docs-item'>
                        <p>Statement</p>
                        <img src={userDocuments.statement} alt="dorm"/>
                    </div>
                </div>
            </div>
            {!userVerifiedOrNot && (
                    <button className='btn-verification' onClick={verifyUser}>Verify</button>
                )}
                {userVerifiedOrNot && (
                    <button onClick={cancelVerifyUser} style={{ backgroundColor: '#E94949' }}>Cancel Verification</button>
            )}
        </div>
    </div>
  )
}

