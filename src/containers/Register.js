import React from 'react'
import { Link, Navigate } from 'react-router-dom'
import { useState } from 'react'
import axios from 'axios'

export default function Register() {
  const [first_name, setName] = useState('')
  const [last_name, setLastName] = useState('')
  const [id_number, setIdNum] = useState('')
  // const [specialty, setSpecialty] = useState('')
  // const [faculty, setFaculty] = useState('')
  const [birth_date, setBirthDate] = useState('')
  const [gender, setSelectedGender] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [password_confirm, setConfirmPassword] = useState('')
  const [redirect, setRedirect] = useState(false)
  const [errorRegister, setErrorRegister] = useState('')
  const [successfullyRegister, setSuccessfullyRegister] = useState('')
  const [faculty, setSelectedFaculty] = useState("");
  const [specialty, setSelectedSpeciality] = useState("");

  const specialities = [
    {
        "id": 1,
        "name": "Information Systems",
        "faculty": 1
    },
    {
        "id": 2,
        "name": "Computer Sciences",
        "faculty": 1
    },
    {
        "id": 3,
        "name": "Mathematical and Computer modeling",
        "faculty": 1
    },
    {
        "id": 4,
        "name": "Mathematics",
        "faculty": 1
    },
    {
        "id": 5,
        "name": "Multimedia Sciences",
        "faculty": 1
    },
    {
        "id": 6,
        "name": "Statistics and Data science",
        "faculty": 1
    },
    {
        "id": 7,
        "name": "Accounting and Audit",
        "faculty": 6
    },
    {
        "id": 8,
        "name": "Digital Marketing",
        "faculty": 6
    },
    {
        "id": 9,
        "name": "Economics",
        "faculty": 6
    },
    {
        "id": 10,
        "name": "Finance",
        "faculty": 6
    },
    {
        "id": 11,
        "name": "Management",
        "faculty": 6
    },
    {
        "id": 12,
        "name": "Applied philology",
        "faculty": 5
    },
    {
        "id": 13,
        "name": "Chemistry and Biology",
        "faculty": 5
    },
    {
        "id": 14,
        "name": "Foreign Language: Two Foreign Languages",
        "faculty": 5
    },
    {
        "id": 15,
        "name": "History",
        "faculty": 5
    },
    {
        "id": 16,
        "name": "Informatics",
        "faculty": 5
    },
    {
        "id": 17,
        "name": "Kazakh language and literature",
        "faculty": 5
    },
    {
        "id": 18,
        "name": "Mathematics(Pedagogical)",
        "faculty": 5
    },
    {
        "id": 19,
        "name": "Pedagogy and Methods for primary education",
        "faculty": 5
    },
    {
        "id": 20,
        "name": "Pedagogy and Psychology",
        "faculty": 5
    },
    {
        "id": 21,
        "name": "Physics Informatics",
        "faculty": 5
    },
    {
        "id": 22,
        "name": "Preschool training and education",
        "faculty": 5
    },
    {
        "id": 23,
        "name": "Social Pedagogy based on values",
        "faculty": 5
    },
    {
        "id": 24,
        "name": "Translation studies",
        "faculty": 5
    },
    {
        "id": 25,
        "name": "Applied Law",
        "faculty": 7
    },
    {
        "id": 26,
        "name": "International Law",
        "faculty": 7
    },
    {
        "id": 27,
        "name": "International relations",
        "faculty": 7
    },
    {
        "id": 28,
        "name": "Law of Public Administration",
        "faculty": 7
    },
    {
        "id": 29,
        "name": "Multimedia and TV journalism",
        "faculty": 7
    }
]


  const submit = async (e) =>{
    e.preventDefault();
    
     try{
      const response = await axios.post('register/', {
        first_name, last_name, id_number, specialty, faculty, birth_date, gender, email, password, password_confirm
      });

      // console.log(response.response.data.email);
      console.log(response);

      if(response.status == 201){
        setTimeout(()=> setRedirect(true),10000);
        setErrorRegister('')
        setSuccessfullyRegister('You registered succesfully! Please check your email')
      }else{
        setErrorRegister(response.response.data.email)
        setSuccessfullyRegister('')
      }
     }catch(err){
        console.error("Ошибка: ", err);
     }
  }

  if(redirect){
      return <Navigate to='/' replace />;
  }

  const handleFacultyChange = (event) => {
    setSelectedFaculty(event.target.value);
    // Сброс выбранного специализации при смене факультета
    setSelectedSpeciality('');
};

  const handleSpecialityChange = (event) => {
    setSelectedSpeciality(event.target.value);
  };

  const handleGenderChange = (event) => {
    setSelectedGender(event.target.value);
};

 const getSpecialityOptions = (faculty) =>{
    // Фильтруем специальности по переданному факультету
    const filteredSpecialities = specialities.filter(speciality => speciality.faculty == faculty);
    
    // Получаем только имена специальностей
    const specialityRes = filteredSpecialities.map(speciality => ({ id: speciality.id, name: speciality.name }));

    return specialityRes;
 }

 // Динамическое создание опций для коридоров
 const specialityOptions = faculty ? getSpecialityOptions(faculty) : [];

console.log("Faculty: " + faculty);
console.log("Speciality: " + specialty);
console.log("Gender: " + gender);

  return (
    <main>
      <div className="welcome">
          <div className="welcome-items">
              <div className="img">
                  <img src={require('../img/SignUpImg.png')} alt="img"/>
              </div>
              <div className="welcome-content">
                  <h2 className="welcome-title">Welcome to Dorm Hub platform!</h2>
                  <p className="welcome-desc">Welcome to Dorm Hub platform ! Dorm Hub is an online platform developed in the user friendly interface to make it easier for SDU students to book a seat in a dormitory.</p>
              </div>
          </div>
      </div>
      <div className="signing">
          <div className="container container-up">
              <div className="form-content">
                  <div className="title-content title-content-up">
                      <h2>Sign up</h2>
                      <p>To sign up in the system, please fill out the forms below.</p>
                  </div>
                  <form onSubmit={submit}>
                    <div className="field-component field-signup">
                      <input 
                      type="text" placeholder="First Name" id="first_name"
                      onChange={e => setName(e.target.value)}
                      required
                      />
                    </div>
                    <div className="field-component field-signup">
                      <input 
                      type="text" placeholder="Last Name" id="last_name"
                      onChange={e => setLastName(e.target.value)}
                      required
                      />
                    </div>
                    <div className="field-component field-signup">
                      <input 
                      type="email" placeholder="Email" id="email"
                      onChange={e => setEmail(e.target.value)}
                      required
                      style={{ border: errorRegister ? '1.6px solid #E94949' : ''}}
                      />
                    </div>
                    <div className="field-component field-signup">
                      <input 
                      type="number" placeholder="ID number" id="id_number"
                      onChange={e => setIdNum(e.target.value)}
                      required
                      />
                    </div>
                    <div className="field-component field-signup">
                      <select id="faculty-select" value={faculty} onChange={handleFacultyChange}>
                          <option value="">Select the faculty</option> {/* Опция по умолчанию */}
                          <option value="1">Faculty of Engineering and Natural sciences</option> {/* Значения для этажей */}
                          <option value="5">Faculty of Education and Humanities</option>
                          <option value="6">Business School</option>
                          <option value="7">Faculty of Law and Social sciences</option>
                      </select>
                    </div>
                    <div className="field-component field-signup">
                      <select id="speciality-select" value={specialty} onChange={handleSpecialityChange}>
                          <option value="">Select the speciality</option> {/* Опция по умолчанию */}
                          {specialityOptions.map((option, index) => (
                                        <option key={index} value={option.id}>{option.name}</option>
                          ))}
                      </select>
                    </div>
                    <div className="field-component field-signup">
                      <input 
                      type="date" placeholder="Birth date" id="birth_date"
                      onChange={e => setBirthDate(e.target.value)}
                      required
                      />
                    </div>
                    <div className="field-component field-signup">
                      {/* <input 
                      type="text" placeholder="Gender" id="gender"
                      onChange={e => setGender(e.target.value)}
                      required
                      /> */}
                      <select id="gender-select" value={gender} onChange={handleGenderChange}>
                          <option value="">Select the gender</option> {/* Опция по умолчанию */}
                          <option value="Male">Male</option> {/* Значения для этажей */}
                          <option value="Female">Female</option>
                      </select>
                    </div>
                    <div className="field-component field-signup">
                      <input 
                      type="password" placeholder="Create Password" id="password"
                      onChange={e => setPassword(e.target.value)}
                      required
                      />
                    </div>
                    <div className="field-component field-signup">
                      <input 
                      type="password" placeholder="Confirm Password" id="password_confirm"
                      onChange={e => setConfirmPassword(e.target.value)}
                      required
                      />
                    </div>
                    <p className='error-register' style={{ color: successfullyRegister? '#00A35D':''}}>{successfullyRegister ? successfullyRegister : errorRegister}</p>
                    <div class="additional">
                        <div class="remember-chkbx">
                            <input type="checkbox" name="remember" id="remember"/>
                            <label for="remember">I agree to the privacy terms</label>
                        </div>
                    </div>
                    <button className="btn">Sign up</button>
                  </form>
              </div>
              <h4>Do you already have an account? <Link to = '/'>Click here</Link></h4>
          </div>
      </div>
</main>
  )
}
