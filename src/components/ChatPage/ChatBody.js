import React, { useEffect, useState, useRef } from 'react';
import ChatForm from './ChatForm';
import axios from 'axios';


const ChatBody = ({ user, setUpdateChats, chat, socket }) => {

    const [typerName, setTyperName] = useState('');
    const [chatDetail, setChatDetail] = useState('')
    const [messages, setMessages] = useState([])
    const [updateMessages, setUpdateMessages] = useState(0);
    const chatFormRef = useRef(null);

    useEffect(()=>{
        socket.on('typing', typerName => {
            setTyperName(typerName);
        })

        socket.on('stoptyping',()=> {
            setTyperName('');
        })
    },[socket])

    socket.on("messageupdate",()=>{
        setUpdateMessages(prev=>prev+1);
    })

    useEffect(()=>{
        if(chatFormRef.current)
        chatFormRef.current.scrollIntoView({ block: 'start' })
    })

    useEffect(() => {
        if (chat) {
            if (chat.isGroupChat)
                setChatDetail(chat);
            else
                setChatDetail(chat.users[0]._id === user._id ? chat.users[1] : chat.users[0])
        }
    }, [chat, user])

    useEffect(() => {
        axios.get('/api/message/accessmessage', {
            params: {
                chatId: chat._id
            },
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('jt')}`
            }
        })
            .then(res => setMessages(res.data))
            .catch(err => console.log(err));
    }, [updateMessages, setMessages, chat])

    const handleLeavegroup = () => {
        const data = {
            chatId: chat._id,
            userId: user._id
        }

        axios.post('/api/chat/leavegroup', data, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('jt')}`
            }
        })
            .then(res => setUpdateChats(prev => prev + 1), setChatDetail({ isGroupChat: false, name: "Chat not found", picture: "picture" }))
            .catch(err => console.log(err))
    }

    return (
        <div className='chatbody'>
            {
                chat &&
                <nav className="navbar navbar-light bg-light justify-content-start chatuserheader">
                    <div className='chat_navbar'>
                        <img className='chatuser_picture' src={chatDetail.picture} alt="chatuser_picture" />
                        <p className='chatname'>{chat.isGroupChat ? chatDetail.chatName : chatDetail.name}</p>
                        <div className='groupcontrol'>
                            {chat.isGroupChat && <button className="btn leavegroupbtn" type="button" onClick={handleLeavegroup}>Leave Chat</button>}
                        </div>
                    </div>
                    {
                        messages && messages.length > 0 &&
                        <div className='message_container'>
                            {messages.map( (message, index) => {
                                return <div key={message._id} ref={index===messages.length-1?chatFormRef:null} className={message.user.name === user.name ? 'message_sent' : 'message_received'}>
                                    <p className={message.user.name === user.name ? 'sender_name' : 'receiver_name'}>{message.user.name}</p>
                                    <p className='message_text'>{message.text}</p>
                                </div>
                            })}
                        </div>
                    }
                    { typerName && typerName!==user.name && <label>{typerName} is typing...</label>}
                    <ChatForm user={user} socket={socket} chat={chat} />
                </nav>
            }
        </div>
    );
}

export default ChatBody;