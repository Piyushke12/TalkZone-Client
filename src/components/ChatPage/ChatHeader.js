import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ChatHeader = ({ socket, setUpdateChats, user, setChat }) => {

    const navigate = useNavigate();
    const [email, setEmail] = useState('')
    const [searchedchat, setSearchedchat] = useState('')
    const [errorMessage, setErrorMessage] = useState('')

    useEffect(() => {
        setChat(searchedchat)
        setUpdateChats(prev => prev + 1)
    }, [searchedchat, setChat, setUpdateChats])

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = {
            email: email
        }

        await axios.post('/api/user/getuser', data, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('jt')}`
            }
        })
            .then(res => {
                axios.post('/api/chat/accesschat', { userId: user._id, searcheduserId: res.data._id }, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('jt')}`
                    }
                })
                    .then(res => { setSearchedchat(res.data); setErrorMessage(""); setEmail("") })
                    .catch(err => console.log(err))
            })
            .catch(err => {
                setErrorMessage("No User Found")
            })
    }

    const handleLogout = async (e) => {
        e.preventDefault();
        localStorage.removeItem('ud');
        localStorage.removeItem('jt');
        navigate('/');
    }

    return (
        <div id='mainpageheader'>
            <nav className="navbar navbar-light bg-light justify-content-between">
                <p>
                    <img className='profilepicture' src={user.picture} alt='profile_img' />
                    <label>{user.name}</label>
                </p>
                <p className="navbar-brand title">Talk Zone</p>
                <form className="form-inline" onSubmit={handleSubmit}>
                    <input className="form-control mr-sm-2 chatsearchinput" type="search" aria-label="Search"
                        placeholder="Search User"
                        value={email}
                        required
                        onChange={e => setEmail(e.target.value)} />
                </form>
                <button className="btn btn-danger my-2 my-sm-0" type="button" onClick={handleLogout}>Logout</button>
                {errorMessage && <p id='headererror'>{errorMessage}</p>}
            </nav>
        </div>
    );
}

export default ChatHeader;