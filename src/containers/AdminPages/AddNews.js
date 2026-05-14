import React, { useContext, useState } from 'react'
import Navbar from '../../components/Navbar'
import { useNavigate } from 'react-router';
import AuthContext from '../../context/AuthContext';

export default function AddNews() {
    const navigate = useNavigate();
    const {authTokens} = useContext(AuthContext);

    const [title, setSelectedCategory] = useState("");
    const [content, setTitle] = useState("");
    const [file, setFile] = useState('')

    const handleCategoryChange = (event) => {
        setSelectedCategory(event.target.value);
    };

    const submit = async (e) =>{
        e.preventDefault();
        
         try{
            const formData = new FormData()
            formData.append('title', title);
            formData.append('content', content);
            formData.append('file', file);
            const response = await fetch('http://localhost:8000/news/', {
                method: 'POST',
                body: formData,
                headers: {
                    'Authorization': `Bearer ${authTokens.access}`,
                },
            });
    
          // console.log(response.response.data.email);
          console.log(await response.json());
    
          if(response.ok){
            navigate('/congrats-published');
          }
         }catch(err){
            console.error("Ошибка: ", err);
         }
      }
    
  return (
    <div className='add-news'>
        <Navbar/>
        <div className='add-news-container'>
            <div className='add-news-content'>
                <div className='add-news-logo'>
                    <img src={require('../../img/logoDorm.png')} alt='add-news-logo'/>
                </div>
                <div className='add-news-title'>
                    <div className='add-title'>
                        <h2>Publish News</h2>
                        <p>Here you, as a site administrator, can publish news to the attention of students!</p>
                    </div>
                    <div className='add-news-img'>
                        <img src={require('../../img/add-news.png')} alt='add-news-img'/>
                    </div>
                </div>
                <form className='add-news-form' onSubmit={submit}>
                    <select id="floor-select" className='add-news-select' value={title} onChange={handleCategoryChange}>
                        <option value="">Selected Category</option>
                        <option value="Dorm Hub News">Dorm Hub News</option>
                        <option value="AC Catering News">AC Catering News</option>
                    </select>
                    <div className='add-news-withLabel'>
                        <label className='add-news-label'>Enter a news title</label>
                        <input 
                        type="txt" placeholder="Current Title" id="title"
                        onChange={e => setTitle(e.target.value)}
                        required
                        />
                    </div>
                    <div className='custom-file-input add-news-file'>
                        <input 
                            type="file" id="file" name="file"
                            onChange={e => setFile(e.target.files[0])}
                            required
                            placeholder='Upload File'
                        />
                        <img src={require('../../img/round-upload.png')} alt="logo"/>
                        <p>{file? file.name : "Upload File"}</p>  
                    </div>
                    <button className='add-news-btn'>Publish</button>
                </form>
            </div>
        </div>
    </div>
  )
}
