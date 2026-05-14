import React from 'react'
import Navbar from '../../components/Navbar'
import { useNavigate } from 'react-router';

function CongratsBooking() {
  const navigate = useNavigate();
  return (
    <div className='oops congrats-booking'>
        <Navbar/>
        <div className='oops-container doc-submitted-container congrats-container'>
            <div className='congrats-img'>
                <img src={require('../../img/congrats.png')} alt="congrats"/>
            </div>
            <div className='oops-content doc-submitted-content congrats-content'>
                <h1 className='oops-title doc-submitted-title'>Congratulations!</h1>
                <p className='oops-message doc-submitted-message'>Congratulations, you made a successful booking! We look forward to seeing you in our hostel! Don't be late to settle down!</p>
            </div>
            <button className='oops-link doc-submitted-link' onClick={()=>navigate('/my-booking')}>Go to My Bookings</button>
        </div> 
    </div>
  )
}

export default CongratsBooking