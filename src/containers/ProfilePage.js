import React, { useContext, useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import AuthContext from '../context/AuthContext';
import { useNavigate } from 'react-router';
import axios from 'axios';
import Modal from 'react-modal';

export default function ProfilePage() {
  const { authTokens } = useContext(AuthContext)
  const userProfile = JSON.parse(localStorage.getItem('userProfile'))
  const navigate = useNavigate();

  const [numTurn, setNumTurn] = useState(1);
  const [userDocuments, setDocumentsOfUser] = useState([])
  const [statement, setStatement] = useState('')
  const [photo_3x4, setPhoto] = useState('')
  const [form_075, setForm] = useState('')
  const [identity_card_copy, setIdentityCart] = useState('')
  const [new_password, setNewPassword] = useState('')
  const [confirm_new_password, setNewConfirmPassword] = useState('')
  const [old_password, setOldPassword] = useState('')
  const [successfullyChanged,setSuccessfullyChanged] = useState('')
  const [errorRegister,setErrorRegister] = useState('')
  const [isModalOpen, setModalOpen] = useState(false)
  const [isModalOpenEProfile, setModalOpenEProfile] = useState(false)

  const [gender, setSelectedGender] = useState('')
  const [first_name, setFirstName] = useState('')
  const [id_number, setStudentId] = useState('')
  const [email, setEmail] = useState('')
  const [faculty_name, setFaculty] = useState('')
  const [docsActionMessage, setDocsActionMessage] = useState('')
  const [deletingField, setDeletingField] = useState('')

  function setNumTurnClick(index){
     setNumTurn(index);
  }

  const handleOpenModal = ()=> {
    setModalOpen(true)
  }

  const handleOpenModalEditProfile = () =>{
    setModalOpenEProfile(true)
  }

  const handleCloseModal = () =>{
      setModalOpen(false)
  }

  const handleCloseModalEditProfile = () =>{
    setModalOpenEProfile(false)
}

const handleChangeGender= (event) => {
  setSelectedGender(event.target.value);
};

const handleFacultyChange= (event) => {
  setFaculty(event.target.value);
};

  const submit = async (e) =>{
    e.preventDefault();
    
     try{
      const response = await axios.post('change-password/', 
                {
                  old_password, new_password, confirm_new_password   
                },
                {
                    headers: {
                        'Authorization': `Bearer ${authTokens.access}`,
                    }
                } )

      console.log(response);

      if(response.status === 200){
        setErrorRegister('')
        setSuccessfullyChanged('You changed password successfully! You will redirected to Login Page')
        setTimeout(()=> navigate('/'), 6000);
      }else{
        let errorMessage = '';
        if(response.response && response.response.data && response.response.data.non_field_errors && response.response.data.non_field_errors[0]){
          errorMessage = response.response.data.non_field_errors[0];
        }else if(response.response && response.response.data && response.response.data.old_password && response.response.data.old_password[0]){
          errorMessage = response.response.data.old_password[0];
        }else{
          errorMessage = response.response.data.confirm_new_password[0];
        }
        setErrorRegister(errorMessage);
        setSuccessfullyChanged('')
      }
     }catch(err){
        console.error("Ошибка: ", err);
     }
  }

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
}, [authTokens]);

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
      await axios.patch('documents/update/', formData, {
          headers: {
              'Content-Type': 'multipart/form-data',
              'Authorization': `Bearer ${authTokens.access}`,
          },
      });

      // Обработка успешного ответа
      window.location.reload()
  } catch (err) {
      console.error('You have problems: ' + err);
  }
};

const deleteDocument = async (fileField) => {
  if (deletingField) {
    return;
  }
  try {
    setDeletingField(fileField)
    setDocsActionMessage('')
    await axios.delete(`delete-document/${fileField}/`, {
      headers: {
        'Authorization': `Bearer ${authTokens.access}`,
      },
    });
    setDocsActionMessage(`${fileField} deleted successfully.`)
    window.location.reload()
  } catch (err) {
    setDocsActionMessage(`Failed to delete ${fileField}.`)
  } finally {
    setDeletingField('')
  }
}

  const userData = userDocuments.length > 0 ? userDocuments[0].user_data : '';
  console.log(userDocuments[0]);

  const getFileName = (filePath, docName) =>{
    const fileName = filePath.substring(filePath.lastIndexOf("/") + 1); // Получаем имя файла из пути
    const formatName = fileName.split('.').pop().toLowerCase(); // Получаем расширение файла
    return `${docName}.${formatName}`;   
  }

  return (
    <div className='profile'>
        <Navbar/>
        <div className='profile-container'>
            <div className='profile-content'>
                <div className='profile-nav profile-page-nav' id='profile-nav'>
                    <button className={numTurn === 1 ? 'active' : ''} onClick={()=>setNumTurnClick(1)}>
                        My Profile
                    </button>
                    <button className={numTurn === 2 ? 'active' : ''} onClick={()=>setNumTurnClick(2)}>
                        Submitted Documents
                    </button>
                </div>
                {numTurn === 1 && (
                    <>
                        <h1>{userProfile.first_name} {userProfile.last_name}</h1>
                        <div className='profile-data'>
                          <div className='user-info-box'>
                              <h3>User information</h3>
                              <div className='user-infos'>
                                  <div className='user-info-item'>
                                      <h4 className='user-info-label'>Full name</h4>
                                      <p className='user-information'>{userProfile.first_name} {userProfile.last_name}</p>
                                  </div>
                                  <div className='user-info-item'>
                                      <h4 className='user-info-label'>Student ID</h4>
                                      <p className='user-information'>{userProfile.id_number}</p>
                                  </div>
                                  <div className='user-info-item'>
                                      <h4 className='user-info-label'>Email</h4>
                                      <p className='user-information'>{userProfile.email}</p>
                                  </div>
                                  <div className='user-info-item'>
                                      <h4 className='user-info-label'>Faculty</h4>
                                      <p className='user-information'>{userProfile.faculty_name}</p>
                                  </div>
                                  <div className='user-info-item'>
                                      <h4 className='user-info-label'>Gender</h4>
                                      <p className='user-information'>{userProfile.gender}</p>
                                  </div>
                              </div>
                          </div>
                          <div className='profile-btns'>
                              <button onClick={()=>{handleOpenModal()}}>Change Password</button>
                              <Modal className='modal modal-changePswd' isOpen={isModalOpen} onRequestClose={()=> handleCloseModal()}>
                                        <h3>Change Password</h3>
                                        <form className='modal-form' onSubmit={submit}>
                                          <input 
                                            type="password" placeholder="Currents Password" id="old_pswd"
                                            onChange={e => setOldPassword(e.target.value)}
                                            required
                                          />
                                          <input 
                                            type="password" placeholder="New Password" id="new_pswd"
                                            onChange={e => setNewPassword(e.target.value)}
                                            required
                                          />
                                          <input 
                                            type="password" placeholder="Confirm New Password" id="confirm_pswd"
                                            onChange={e => setNewConfirmPassword(e.target.value)}
                                            required
                                          />  
                                          <p className='error-register' style={{ color: successfullyChanged? '#00A35D':''}}>{successfullyChanged ? successfullyChanged : errorRegister}</p>
                                          <div className='btns-changePswd'>
                                              <button>Change</button>
                                              <button onClick={()=>{handleCloseModal()}}>Cancel</button>
                                          </div>
                                        </form>
                                </Modal>
                              <button onClick={()=>{handleOpenModalEditProfile()}}>Edit Profile</button>
                              <Modal className='modal modal-changePswd modal-editProfile' isOpen={isModalOpenEProfile} onRequestClose={()=> handleCloseModalEditProfile()}>
                                        <h3>Edit Profile</h3>
                                        <form className='modal-form'>
                                          <input 
                                            type="txt" placeholder="First Name" id="full_name"
                                            value= {first_name ? first_name : userData.first_name}
                                            onChange={e => setFirstName(e.target.value)}
                                            required
                                          />
                                          <input 
                                            type="txt" placeholder="Student ID" id="student_id"
                                            value= {id_number ? id_number : userData.id_number}
                                            onChange={e => setStudentId(e.target.value)}
                                            required
                                          />
                                          <input 
                                            type="email" placeholder="Email" id="email"
                                            value= {email ? email : userData.email}
                                            onChange={e => setEmail(e.target.value)}
                                            required
                                          />
                                          <select id="faculty-select" className='faculty-select-profileEdit' value={faculty_name ? faculty_name : userData.faculty_name} onChange={handleFacultyChange}>
                                              <option value="">Select the faculty</option> {/* Опция по умолчанию */}
                                              <option value="Faculty of Engineering and Natural sciences">Faculty of Engineering and Natural sciences</option> {/* Значения для этажей */}
                                              <option value="Faculty of Education and Humanities">Faculty of Education and Humanities</option>
                                              <option value="Business School">Business School</option>
                                              <option value="Faculty of Law and Social sciences">Faculty of Law and Social sciences</option>
                                          </select>
                                          <select id="gender-select" value={gender ? gender : userProfile.gender} onChange={handleChangeGender}>
                                            <option value="">Select the gender</option> {/* Опция по умолчанию */}
                                            <option value="Male">Male</option> {/* Значения для этажей */}
                                            <option value="Female">Female</option>
                                          </select>
                                          <p className='error-register' style={{ color: successfullyChanged? '#00A35D':''}}>{successfullyChanged ? successfullyChanged : errorRegister}</p>
                                          <div className='btns-changePswd'>
                                              <button>Save</button>
                                              <button onClick={()=>{handleCloseModalEditProfile()}}>Cancel</button>
                                          </div>
                                        </form>
                                </Modal>
                          </div>
                        </div>
                    </>
                )}
                {numTurn === 2 &&(
                  <>
                    {userDocuments === '' ? (
                      <div className='oops-container oops-profile-container'>
                      <div className='oops-img'>
                          <img src={require('../img/oops.png')} alt="oops"/>
                      </div>
                      {userProfile.is_doc_submitted === false &&(
                          <div className='oops-content oops-profile-content'>
                            <h1 className='oops-title'>Oops! You did wrong!</h1>
                            <p className='oops-message'>Sorry, you were wrong! To get access to the booking service, you must first submit the documents to the Dorm administration!</p>
                          </div>
                      )}
                  </div>
                    ):
                    (
                        <div className='user-docs'>
                      <div className='status-container'>
                        <p className='status-txt'>Current Status of Document Submission: </p>
                        <div className='status'>
                          {userDocuments && userDocuments.length > 0 &&(
                            userDocuments[0].is_verified === false ? (
                              <div className='status-doc-submission' style= {{backgroundColor: '#F3A367' }}></div>
                            ):(
                              <div className='status-doc-submission' style= {{backgroundColor: '#00A35D' }}></div>
                            )
                          )}
                          {userDocuments && userDocuments.length > 0 &&
                            (
                              userDocuments[0].is_verified === false ? (
                                <p>Waiting verification of admin</p>
                              ):(
                                <p>Verified by Admin</p>
                              )
                            )}
                        </div>
                      </div>
                      <div className='submitted-doc-list'>
                        <div className='submitted-item'>
                                <div>
                                    <div className='submitted-img'>
                                        <a href={userDocuments[0].statement} target="_blank" rel="noopener noreferrer"><img src={userDocuments[0].statement.endsWith('.pdf') ? require('../img/icons/icon-pdf.png') : 
                                        userDocuments[0].statement.endsWith('.docx') || userDocuments[0].statement.endsWith('.doc') ? 
                                        require('../img/icons/icon-docx.png') : userDocuments[0].statement} alt="submited-item"/></a>
                                    </div>
                                    <p>statement</p>
                                </div>
                                <div className='custom-file-input update-file'>
                                  <input 
                                    type="file" id="state" name="state"
                                    onChange={e => setStatement(e.target.files[0])}
                                    required
                                    placeholder='Updated File'
                                  />
                                  <img src={require('../img/update.png')} alt="logo"/>
                                  <p>{statement ? statement.name : getFileName(userDocuments[0].statement, "statement")}</p>
                                </div>
                                <button type='button' onClick={() => deleteDocument('statement')} disabled={deletingField === 'statement'}>
                                  {deletingField === 'statement' ? 'Deleting...' : 'Delete file'}
                                </button>
                        </div>
                        <div className='submitted-item'>
                          <div>
                            <div className='submitted-img'>
                                <a href={userDocuments[0].photo_3x4} target="_blank" rel="noopener noreferrer"><img src={userDocuments[0].photo_3x4.endsWith('.pdf') ? require('../img/icons/icon-pdf.png') : 
                                userDocuments[0].photo_3x4.endsWith('.docx') || userDocuments[0].photo_3x4.endsWith('.doc') ? 
                                require('../img/icons/icon-docx.png') : userDocuments[0].photo_3x4} alt="submited-item"/></a>
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
                            <p>{photo_3x4 ? photo_3x4.name : getFileName(userDocuments[0].photo_3x4, "photo_3x4")}</p>
                          </div>
                          <button type='button' onClick={() => deleteDocument('photo_3x4')} disabled={deletingField === 'photo_3x4'}>
                            {deletingField === 'photo_3x4' ? 'Deleting...' : 'Delete file'}
                          </button>
                        </div>
                        <div className='submitted-item'>
                          <div>
                            <div className='submitted-img'>
                                <a href={userDocuments[0].form_075} target="_blank" rel="noopener noreferrer"><img src={userDocuments[0].form_075.endsWith('.pdf') ? require('../img/icons/icon-pdf.png') : 
                                userDocuments[0].form_075.endsWith('.docx') || userDocuments[0].form_075.endsWith('.doc') ? 
                                require('../img/icons/icon-docx.png') : userDocuments[0].form_075} alt="submited-item"/></a>
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
                            <p>{form_075 ? form_075.name : getFileName(userDocuments[0].form_075, "form_075")}</p>
                          </div>
                          <button type='button' onClick={() => deleteDocument('form_075')} disabled={deletingField === 'form_075'}>
                            {deletingField === 'form_075' ? 'Deleting...' : 'Delete file'}
                          </button>
                        </div>
                        <div className='submitted-item'>
                          <div>
                              <div className='submitted-img'>
                                  <a href={userDocuments[0].identity_card_copy} target="_blank" rel="noopener noreferrer"><img src={userDocuments[0].identity_card_copy.endsWith('.pdf') ? require('../img/icons/icon-pdf.png') : 
                                  userDocuments[0].identity_card_copy.endsWith('.docx') || userDocuments[0].identity_card_copy.endsWith('.doc') ? 
                                  require('../img/icons/icon-docx.png') : userDocuments[0].identity_card_copy} alt="submited-item"/></a>
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
                            <p>{identity_card_copy ? identity_card_copy.name : getFileName(userDocuments[0].identity_card_copy, "identity_card")}</p>
                          </div> 
                          <button type='button' onClick={() => deleteDocument('identity_card_copy')} disabled={deletingField === 'identity_card_copy'}>
                            {deletingField === 'identity_card_copy' ? 'Deleting...' : 'Delete file'}
                          </button>
                        </div>
                      </div>
                      {statement || photo_3x4 || identity_card_copy || form_075 ? (
                            <div className='update-btn'>
                              <button onClick={()=>fetchData()}>Submit</button>
                            </div>
                        ): null}
                        {docsActionMessage && (
                          <p style={{ marginTop: '12px', color: docsActionMessage.includes('successfully') ? '#00A35D' : '#E94949' }}>
                            {docsActionMessage}
                          </p>
                        )}
                        </div>
                    )}
                  </>
                )}
            </div>
        </div>
    </div>
  )
}
