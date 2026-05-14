import React, { useCallback, useContext, useEffect, useState } from 'react'
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
  const [actionMessage, setActionMessage] = useState('')
  const [deletingField, setDeletingField] = useState('')

  const loadDocuments = useCallback(async () => {
        try {
            const getResponse = await axios.get('documents/get/', {
                headers: {
                    'Authorization': `Bearer ${authTokens.access}`,
                }
            });

            const res = getResponse.data
            setDocumentsOfUser(res)
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }, [authTokens]);

  useEffect(() => {
    loadDocuments();
  }, [loadDocuments]);

  const submitUpdatedDocuments = async () => {
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

          setActionMessage('Documents were updated successfully.');
          await loadDocuments();
          navigate('/main-page');
      } catch (err) {
          setActionMessage('Failed to update documents.');
          console.error('You have problems: ' + err);
      }
  };

  const deleteDocument = async (fileField) => {
    if (deletingField) {
      return;
    }

    try {
      setDeletingField(fileField);
      setActionMessage('');
      await axios.delete(`delete-document/${fileField}/`, {
        headers: {
          'Authorization': `Bearer ${authTokens.access}`,
        },
      });
      setStatement('');
      setPhoto('');
      setForm('');
      setIdentityCart('');
      setActionMessage(`${fileField} deleted successfully.`);
      await loadDocuments();
    } catch (error) {
      setActionMessage(error?.response?.data?.error || `Failed to delete ${fileField}.`);
    } finally {
      setDeletingField('');
    }
  };

  const getFileName = (filePath, docName) =>{
    if (!filePath) {
      return `${docName}.file`;
    }
    const fileName = filePath.substring(filePath.lastIndexOf("/") + 1); // Получаем имя файла из пути
    const formatName = fileName.split('.').pop().toLowerCase(); // Получаем расширение файла
    return `${docName}.${formatName}`;   
  }
  return (
    <div className='update-submission'>
      <Navbar/>
      <div className='update-container'>
        <h1 className='title-update'>Submitted Documents</h1>
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
                {userDocuments && userDocuments.length > 0 && (
                  <>
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
                    <button
                      type='button'
                      style={{ marginTop: '8px' }}
                      onClick={() => deleteDocument('statement')}
                      disabled={deletingField === 'statement'}
                    >
                      {deletingField === 'statement' ? 'Deleting...' : 'Delete file'}
                    </button>
                  </>
                  )}
          </div>
          <div className='submitted-item'>
                {userDocuments && userDocuments.length > 0 && (
                  <>
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
                    <button
                      type='button'
                      style={{ marginTop: '8px' }}
                      onClick={() => deleteDocument('photo_3x4')}
                      disabled={deletingField === 'photo_3x4'}
                    >
                      {deletingField === 'photo_3x4' ? 'Deleting...' : 'Delete file'}
                    </button>
                  </>
                )}
          </div>
          <div className='submitted-item'>
                {userDocuments && userDocuments.length > 0 && (
                  <>
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
                    <button
                      type='button'
                      style={{ marginTop: '8px' }}
                      onClick={() => deleteDocument('form_075')}
                      disabled={deletingField === 'form_075'}
                    >
                      {deletingField === 'form_075' ? 'Deleting...' : 'Delete file'}
                    </button>
                  </>
                )}
          </div>
          <div className='submitted-item'>
                {userDocuments && userDocuments.length > 0 && (
                  <>
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
                    <button
                      type='button'
                      style={{ marginTop: '8px' }}
                      onClick={() => deleteDocument('identity_card_copy')}
                      disabled={deletingField === 'identity_card_copy'}
                    >
                      {deletingField === 'identity_card_copy' ? 'Deleting...' : 'Delete file'}
                    </button>
                  </>
                )}
          </div>
        </div>
        {userDocuments && userDocuments.length > 0 &&
        (
          statement || form_075 || photo_3x4 || identity_card_copy ? (
              <div className='update-btn'>
                <button onClick={()=>submitUpdatedDocuments()}>Submit</button>
              </div>
          ):(
            ''
          )
        )
        }
        {actionMessage && (
          <p style={{ marginTop: '12px', color: actionMessage.includes('successfully') ? '#00A35D' : '#E94949' }}>
            {actionMessage}
          </p>
        )}
      </div>
    </div>
  )
}
