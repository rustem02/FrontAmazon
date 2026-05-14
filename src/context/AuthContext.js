import { createContext, useState } from 'react'
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom'

const AuthContext = createContext()

export const AuthProvider = ({children}) => {
    let [authTokens, setAuthTokens] = useState(() => localStorage.getItem('authTokens') ? JSON.parse(localStorage.getItem('authTokens')) : null)
    let [user, setUser] = useState(() => {
        const storedTokens = localStorage.getItem('authTokens');
        if (!storedTokens) return null;
        try {
            const parsedTokens = JSON.parse(storedTokens);
            return parsedTokens?.access ? jwtDecode(parsedTokens.access) : null;
        } catch (err) {
            return null;
        }
    })
    const [errorLogin, setErrorLogin] = useState('')
    const apiRoot = (process.env.REACT_APP_API_ROOT || 'http://localhost:8000/api').replace(/\/$/, '')

    const getOrCreateDeviceToken = () => {
        const key = 'deviceToken'
        const existingToken = localStorage.getItem(key)
        if (existingToken) {
            return existingToken
        }
        const generated = `web_${Date.now()}_${Math.random().toString(36).slice(2, 12)}`
        localStorage.setItem(key, generated)
        return generated
    }

    const registerDeviceToken = async (accessToken) => {
        const token = getOrCreateDeviceToken()
        try {
            await fetch(`${apiRoot}/notifications/device-token/`, {
                method:'POST',
                headers:{
                    'Content-Type':'application/json',
                    'Authorization': `Bearer ${accessToken}`,
                },
                body: JSON.stringify({ token, platform: 'web', is_active: true }),
            })
        } catch (error) {
            console.error('Failed to register device token:', error)
        }
    }

    const deactivateDeviceToken = async (accessToken) => {
        const token = localStorage.getItem('deviceToken')
        if (!token) {
            return
        }
        try {
            await fetch(`${apiRoot}/notifications/device-token/`, {
                method:'DELETE',
                headers:{
                    'Content-Type':'application/json',
                    'Authorization': `Bearer ${accessToken}`,
                },
                body: JSON.stringify({ token }),
            })
        } catch (error) {
            console.error('Failed to deactivate device token:', error)
        }
    }

    const navigate = useNavigate();

    let loginUser = async (e)=> {
        const baseApi = process.env.REACT_APP_API_LOGIN_URL || 'http://localhost:8000/api/login/'
        e.preventDefault()
        try{
            let response = await fetch(baseApi, {
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
                registerDeviceToken(data.access)
                
                navigate('/main-page')
            }else{
                setErrorLogin(data.non_field_errors[0])
            }
        }catch(err){
            console.error("Ошибка: ", err);
        }
    }

    // console.log(authTokens);


    let logoutUser = async () => {
        const accessToken = authTokens?.access
        if (accessToken) {
            try {
                await fetch(`${apiRoot}/logout/`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                    },
                })
            } catch (error) {
                console.error('Failed to notify backend about logout:', error)
            }
            await deactivateDeviceToken(accessToken)
        }
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