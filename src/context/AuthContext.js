import { createContext, useState } from 'react'
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom'

const AuthContext = createContext()

export const AuthProvider = ({children}) => {
    let [authTokens, setAuthTokens] = useState(()=> localStorage.getItem('authTokens') ? JSON.parse(localStorage.getItem('authTokens')) : null)
    let [user, setUser] = useState(()=> localStorage.getItem('authTokens') ? jwtDecode(localStorage.getItem('authTokens')) : null)
    const [errorLogin, setErrorLogin] = useState('')

    const navigate = useNavigate();

    let loginUser = async (e)=> {
        e.preventDefault()
        try{
            let response = await fetch('http://13.49.18.134/api/login/', {
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify({'email':e.target.email.value, 'password':e.target.password.value})
            })
            let data = await response.json()

            console.log(data);

            if(response.status === 200){
                setAuthTokens(data)
                setUser(jwtDecode(data.access))
                setErrorLogin('')

                localStorage.setItem('authTokens', JSON.stringify(data))
                
                navigate('/main-page')
            }else{
                setErrorLogin(data.non_field_errors[0])
            }
        }catch(err){
            console.error("Ошибка: ", err);
        }
    }

    // console.log(authTokens);


    let logoutUser = () => {
        setAuthTokens(null)
        setUser(null)
        localStorage.removeItem('authTokens')
        navigate('/')
    }

    let contextData = {
        user:user,
        authTokens:authTokens,
        loginUser:loginUser,
        logoutUser:logoutUser,
        errorLogin: errorLogin,
        setErrorLogin:setErrorLogin,
    }

    return(
        <AuthContext.Provider value={contextData} >
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext;