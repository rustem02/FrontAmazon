import React, { useContext, useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import { useNavigate } from 'react-router';

export default function UpdateSubmission() {

  const { authTokens } = useContext(AuthContext)
  const navigate = useNavigate();

  const [userDocuments, setDocumentsOfUser] = useState([])
  const [statement, setStatement] = useState('')
  const [photo_3x4, setPhoto] = useState('')
  const [form_075, setForm] = useState('')
  const [identity_card_copy, setIdentityCart] = useState('')

  useEffect(() => {
    const fetchData = async () => {
        try {
            // Выполняем GET запрос
            const getResponse = await axios.get('documents/get/', {
                headers: {
                    'Authorization': `Bearer ${authTokens.access}`,
                }
            });

            const res = getResponse.data
            setDocumentsOfUser(res)

            // console.log("Документы пользователя: ", res);
        } catch (error) {
            // Обработка ошибок
            console.error('Error fetching data:', error);
        }
    };

    fetchData(); // Вызов функции для выполнения запроса при загрузке компонента
}, []);

  const fetchData = async () => {
      const formData = new FormData();

      if (statement) {
          formData.append('statement', statement);
      }
      if (photo_3x4) {
          formData.append('photo_3x4', photo_3x4);
      }
      if (form_075) {
          formData.append('form_075', form_075);
      }
      if (identity_card_copy) {
          formData.append('identity_card_copy', identity_card_copy);
      }

      try {
          const response = await axios.patch('documents/update/', formData, {
              headers: {
                  'Content-Type': 'multipart/form-data',
                  'Authorization': `Bearer ${authTokens.access}`,
              },
          });

          // Обработка успешного ответа
          console.log(response.data);
          navigate('/main-page');
      } catch (err) {
          console.error('You have problems: ' + err);
      }
  };

  console.log(userDocuments);
  return (
    <div className='update-submission'>
      <Navbar/>
      <div className='update-container'>
        <h1 className='title-update'>Submitted Documents</h1>
        <div className='status-container'>
          <p className='status-txt'>Current Status of Document Submission: </p>
          <div className='status'>
            {userDocuments && userDocuments.length > 0 &&(
              userDocuments[0].is_verified == false ? (
                <div className='status-doc-submission' style= {{backgroundColor: '#F3A367' }}></div>
              ):(
                <div className='status-doc-submission' style= {{backgroundColor: '#00A35D' }}></div>
              )
            )}
            {userDocuments && userDocuments.length > 0 &&
              (
                userDocuments[0].is_verified == false ? (
                  <p>Waiting verification of admin</p>
                ):(
                  <p>Verified by Admin</p>
                )
              )}
          </div>
        </div>
        <div className='submitted-doc-list'>
          <div className='submitted-item'>
                {userDocuments && userDocuments.length > 0 && (
                  <>
                    <div>
                      <div className='submitted-img'>
                        <img src={userDocuments[0].statement} alt="submited-item"/>
                      </div>
                      <p>statement</p>
                    </div>
                  </>
                 )}

                 {userDocuments && userDocuments.length > 0 && (
                    <div className='custom-file-input update-file'>
                      <input 
                        type="file" id="state" name="state"
                        onChange={e => setStatement(e.target.files[0])}
                        required
                        placeholder='Updated File'
                      />
                      <img src={require('../img/update.png')} alt="logo"/>
                      <p>{statement ? statement.name : userDocuments[0].statement.substring(userDocuments[0].statement.lastIndexOf("/") + 1)}</p>
                    </div>
                  )}
          </div>
          <div className='submitted-item'>
                {userDocuments && userDocuments.length > 0 && (
                  <>
                  <div>
                    <div className='submitted-img'>
                      <img src={userDocuments[0].photo_3x4} alt="submited-item"/>
                    </div>
                    <p>3x4-photo</p>
                    </div>
                    <div className='custom-file-input update-file'>
                      <input 
                      type="file" id="photo" name="photo"
                      onChange={e => setPhoto(e.target.files[0])}
                      required
                      placeholder='Updated File'
                      />
                      <img src={require('../img/update.png')} alt="logo"/>
                      <p>{photo_3x4 ? photo_3x4.name : userDocuments[0].photo_3x4.substring(userDocuments[0].photo_3x4.lastIndexOf("/") + 1)}</p>
                    </div>
                  </>
                )}
          </div>
          <div className='submitted-item'>
                {userDocuments && userDocuments.length > 0 && (
                  <>
                    <div>
                      <div className='submitted-img'>
                        <img src={userDocuments[0].form_075} alt="submited-item"/>
                      </div>
                      <p>075-form</p>
                    </div>
                    <div className='custom-file-input update-file'>
                      <input 
                      type="file" id="form" name="form"
                      onChange={e => setForm(e.target.files[0])}
                      required
                      placeholder='Updated File'
                      />
                      <img src={require('../img/update.png')} alt="logo"/>
                      <p>{form_075 ? form_075.name : userDocuments[0].form_075.substring(userDocuments[0].form_075.lastIndexOf("/") + 1)}</p>
                    </div>
                  </>
                )}
          </div>
          <div className='submitted-item'>
                {userDocuments && userDocuments.length > 0 && (
                  <>
                    <div>
                      <div className='submitted-img'>
                        <img src={userDocuments[0].identity_card_copy} alt="submited-item"/>
                      </div>
                      <p>identity-card</p>
                    </div>
                    <div className='custom-file-input update-file'>
                        <input 
                        type="file" id="identity" name="identity"
                        onChange={e => setIdentityCart(e.target.files[0])}
                        required
                        placeholder='Updated File'
                        />
                        <img src={require('../img/update.png')} alt="logo"/>
                        <p>{identity_card_copy ? identity_card_copy.name : userDocuments[0].identity_card_copy.substring(userDocuments[0].identity_card_copy.lastIndexOf("/") + 1)}</p>
                    </div> 
                  </>
                )}
          </div>
        </div>
        {userDocuments && userDocuments.length > 0 &&
        (
          statement || form_075 || photo_3x4 || identity_card_copy ? (
              <div className='update-btn'>
                <button onClick={()=>fetchData()}>Submit</button>
              </div>
          ):(
            ''
          )
        )
        }
      </div>
    </div>
  )
}
