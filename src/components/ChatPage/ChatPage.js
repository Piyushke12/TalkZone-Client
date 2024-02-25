import React, { useEffect, useState } from 'react';
import ChatHeader from './ChatHeader';
import ChatList from './ChatList';
import axios from 'axios';
import ChatBody from './ChatBody';
import CryptoJS from 'crypto-js'

const ChatPage = ({ socket }) => {

    const [messages, setMessages] = useState([]);
    const [typingResponse, setTypingResponse] = useState('');
    const [user, setUser] = useState('');
    const [chat, setChat] = useState('');
    const [mychats, setMychats] = useState([]);
    const [updateChats, setUpdateChats] = useState(0)

    useEffect(() => {
        const data = {
            email: CryptoJS.AES.decrypt(localStorage.getItem('ud'),"mern-stack").toString(CryptoJS.enc.Utf8)
        }
        axios.post('/api/user/getuser', data, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('jt')}`
            }
        })
            .then(res => setUser(res.data))
            .catch(err => console.log(err))
    }, [])

    useEffect(() => {
        if (user) {
            axios.get('/api/chat/getallchat', {
                params: {
                    userId: user._id
                },
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('jt')}`
                }
            })
                .then(res => {setMychats(res.data);})
                .catch(err => console.log(err))
        }
    }, [user, updateChats])

    useEffect(() => {
        socket.on('message', data => {
            setMessages([...messages, data])
        });
    }, [socket, messages]);

    useEffect(() => {
        socket.on('typingResponse', data => setTypingResponse(data));
    }, [socket, typingResponse]);


    return (
        <div className='chatpage'>
            <ChatHeader user={user} setUpdateChats={setUpdateChats} socket={socket} setChat={setChat} />
            <div className='chatcontainer'>
                <ChatList user={user} setUpdateChats={setUpdateChats} socket={socket} setChat={setChat} mychats={mychats} />
                <ChatBody user={user} setUpdateChats={setUpdateChats} chat={chat} socket={socket} />
            </div>
        </div>
    );
}

export default ChatPage;