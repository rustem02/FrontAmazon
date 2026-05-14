import React from 'react'
import Navbar from '../../components/Navbar'
import { useNavigate } from 'react-router'

export default function CongratsPublished() {
    const navigate = useNavigate();

  return (
    <div className='oops congrats-booking congrats-published'>
        <Navbar/>
        <div className='oops-container doc-submitted-container congrats-container'>
            <div className='congrats-img published-img'>
                <img src={require('../../img/congrats-published.png')} alt="congrats"/>
            </div>
            <div className='oops-content doc-submitted-content congrats-content'>
                <h1 className='oops-title doc-submitted-title'>Successfully Published! </h1>
                <p className='oops-message doc-submitted-message'>Congratulations! Successfully Published your News</p>
            </div>
            <button className='oops-link doc-submitted-link' onClick={()=>navigate('/news-admin')}>Go to News Page</button>
        </div> 
    </div>
  )
}
