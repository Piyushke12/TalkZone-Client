import React, { useState } from "react";
import axios from 'axios';

const ChatForm = ({ socket, user, chat }) => {

    const [message, setMessage] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();

        const formData = {
            message:message,
            user:user._id,
            chat:chat._id
        }

        if(message)
        {
            axios.post('/api/message/sendmessage', formData, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('jt')}`
                }
            })
            .then(res => {
                setMessage("");
                socket.emit("messageupdate");
            })
            .catch(err=> console.log(err))
        }
    }

    const handleInputChange = (event)=> {
        setMessage(event.target.value)
        socket.emit('typing',user.name)
    }

    return (
        <form id="chatform" onSubmit={handleSubmit}>
            <input type="text" className="form-control"
                aria-describedby="basic-addon3"
                placeholder="Type your Message here"
                value={message}
                required
                onChange={handleInputChange}
                onBlur={()=>{socket.emit('stoptyping',user.name)}}
            />
            <button type="submtit " className="btn btn-primary sendmessagebtn">Send</button>
        </form>
    );
}

export default ChatForm;