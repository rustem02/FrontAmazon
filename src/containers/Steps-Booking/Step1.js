import React, { useContext, useEffect, useState } from 'react'
import AuthContext from '../../context/AuthContext';
import axios from 'axios'

export default function Step1() {
    const {authTokens} =useContext(AuthContext)
    const [step, setStep] = useState(1);
    const [selectedBlock, setSelectedBlock] = useState("");

    const gender = authTokens.user.gender

    const handleBlockClick = (block) => {
      setSelectedBlock(block);
    };

    const handleNextClick = () => {
        if(selectedBlock){
            setStep(2)
            localStorage.setItem('step1Data', JSON.stringify({step:step,selectedBlock:selectedBlock}))
        }
    };

  return (
    <>
                            <p>Please, select the block</p>
                            <div className='btn-group'>
                            {gender === 'Male' ? (
                                <>
                                    <button className={`block ${selectedBlock === 'C-block' ? 'selected' : ''}`}
                                    onClick={() => handleBlockClick('C-block')} >C-block</button>
                                    <button className={`block ${selectedBlock === 'D-block' ? 'selected' : ''}`}
                                    onClick={() => handleBlockClick('D-block')}>D-block</button>
                                </>
                              ) : (
                                <>
                                    <button className={`block ${selectedBlock === 'A-block' ? 'selected' : ''}`}
                                    onClick={() => handleBlockClick('A-block')} >A-block</button>
                                    <button className={`block ${selectedBlock === 'B-block' ? 'selected' : ''}`}
                                    onClick={() => handleBlockClick('B-block')}>B-block</button>
                                </>
                              )}
                            </div>
                            <button className='btn-next'
                            disabled={!selectedBlock}
                            onClick={handleNextClick}>
                                Next
                            </button>
                        </>
  )
}
