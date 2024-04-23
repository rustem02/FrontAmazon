import React from 'react'
import Navbar from '../../components/Navbar'
import {useNavigate} from 'react-router-dom'

export default function DocSumbitted() {
    const navigate = useNavigate();
  return (
    <div className='oops doc-submitted'>
        <Navbar/>
        <div className='oops-container doc-submitted-container'>
            <div className='oops-img doc-submitted-img'>
                <img src={require('../../img/docsubmitted.png')} alt="oops"/>
            </div>
            <div className='oops-content doc-submitted-content'>
                <h1 className='oops-title doc-submitted-title'>Congratulations!</h1>
                <p className='oops-message doc-submitted-message'>Your documents have been successfully submitted for Dorm Validation! We will let you notified if your documents are correct or not.</p>
            </div>
            <a className='oops-link doc-submitted-link' onClick={()=>navigate('/main-page')}>Go to Main Page</a>
           
        </div> 
    </div>
  )
}
