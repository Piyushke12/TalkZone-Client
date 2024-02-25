import React, { useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom"
import axios from 'axios'
import CryptoJS from 'crypto-js'

const Home = ({ socket }) => {
    const navigate = useNavigate()

    const [signupPage, setSignupPage] = useState(false);
    const [userName, setUserName] = useState("")
    const [password, setPassword] = useState("")
    const [email, setEmail] = useState("")
    const [flashMessage, setFlashMessage] = useState('')
    const [errorMessage, setErrorMessage] = useState('')

    useEffect(()=>{
        if(localStorage.getItem('jt'))
        navigate('/chat')
    },[navigate])


    const handleLogin = (e) => {
        e.preventDefault();
        const user = {
            email: email,
            password: password
        }
        axios.post('/api/user/login', user)
            .then(res => {
                localStorage.setItem("ud", CryptoJS.AES.encrypt(res.data.user.email,"mern-stack").toString())
                localStorage.setItem("jt", res.data.token)
                navigate("/chat")
            })
            .catch(err => {
                setErrorMessage(err)
                setEmail('')
                setPassword('')
            })
    }

    const handleSignup = (e) => {
        e.preventDefault();
        const user = {
            name: userName,
            password: password,
            email: email
        }
        axios.post('/api/user/register', user)
            .then(res => {
                if(res.status === 200)
                {
                    setFlashMessage(res.data)
                    setSignupPage(false);
                    setErrorMessage('');
                }
                else 
                {
                    setErrorMessage(res.data)
                    setFlashMessage('')
                }
            })
            .catch(err => console.log(err))
    }

    const handleLoginPage = (event) => {
        setSignupPage(false);
    }

    const handleSignupPage = (event) => {
        setSignupPage(true);
    }

    return (

        <div className='homepage'>
            <h1 className='apptitle'>Talk Zone</h1>
            {
                signupPage ?
                    <div className='formcontainer'>
                        <form className='home__container' onSubmit={handleSignup}>
                            <div className='homepagebtn_container'>
                                <button className='homepagebtn' onClick={handleLoginPage}>LOG IN</button>
                                <button className='homepagebtn' onClick={handleSignupPage}>SIGN UP</button>
                            </div>
                            {
                                flashMessage && <p>{flashMessage}</p>

                            }
                            {
                                errorMessage && <p>{errorMessage}</p>
                            }
                            <label className='input_label' htmlFor="username">Username</label>
                            <input type="text"
                                name="username"
                                id='username'
                                className='username__input'
                                value={userName}
                                required
                                onChange={e => setUserName(e.target.value)} />

                            <label className='input_label' htmlFor="email">Email</label>
                            <input type="email"
                                name="email"
                                id='username'
                                className='username__input'
                                value={email}
                                required
                                onChange={e => setEmail(e.target.value)} />

                            <label className='input_label' htmlFor="password">Password</label>
                            <input type="password"
                                name="password"
                                id='username'
                                className='username__input'
                                value={password}
                                required
                                onChange={e => setPassword(e.target.value)} />
                            <button className='home__cta'>SIGN IN</button>
                        </form>
                    </div>
                    :
                    <div className='formcontainer'>
                        <form className='home__container' onSubmit={handleLogin}>
                            <div className='homepagebtn_container'>
                                <button className='homepagebtn' onClick={handleLoginPage}>LOG IN</button>
                                <button className='homepagebtn' onClick={handleSignupPage}>SIGN UP</button>
                            </div>
                            {
                                flashMessage && <p>{flashMessage}</p>

                            }
                            {
                                errorMessage && <p>{errorMessage}</p>
                            }
                            <label className='input_label' htmlFor="email">Email</label>
                            <input type="email"
                                name="email"
                                id='username'
                                className='username__input'
                                value={email}
                                required
                                onChange={e => setEmail(e.target.value)} />

                            <label className='input_label' htmlFor="password">Password</label>
                            <input type="password"
                                name="password"
                                id='username'
                                className='username__input'
                                value={password}
                                required
                                onChange={e => setPassword(e.target.value)} />
                            <button className='home__cta'>LOG IN</button>
                        </form>
                    </div>
            }
        </div>
    )
}

export default Home;