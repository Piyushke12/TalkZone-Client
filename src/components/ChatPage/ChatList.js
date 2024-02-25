import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import $ from 'jquery';

function ChatList({ user, socket, setChat, setUpdateChats, mychats }) {

    const closeRef = useRef();
    const [groupName, setGroupName] = useState('')
    const [error, setError] = useState('')
    const [selectedUsers, setselectedUsers] = useState({})
    const [nonGroupChats, setNonGroupChats] = useState([])

    const handleChatClick = (chat) => {
        setChat(chat);
        socket.emit('joinRoom',{userId:user._id, roomId:chat._id})
    }

    useEffect(()=> {
        setNonGroupChats(mychats.filter(chat => chat.isGroupChat===false));
    },[mychats])

    useEffect(()=>{
        const initialCheckedState = {}
        mychats.forEach(chat => 
            initialCheckedState[chat.users[0]._id === user._id ? chat.users[1]._id : chat.users[0]._id]= false
        )
        setselectedUsers(initialCheckedState);
    // eslint-disable-next-line
    },[])


    const handleCheckBoxClick = (event) => {
        const {name, checked} = event.target;
        setselectedUsers({...selectedUsers, [name] : checked})
    }

    const handleCreateGroup = () => {
        if (!groupName)
            return setError("Required")
        setError('')
        
        const membersToAdd = Object.keys(selectedUsers)
        membersToAdd.push(user._id)

        const data = { groupName: groupName, selectedUsers: membersToAdd }
        axios.post('/api/chat/creategroupchat', data, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('jt')}`
            }
        })
            .then(res => {
                setChat(res.data)
                setUpdateChats(prev => prev + 1)
                setGroupName('')
                setselectedUsers([])

                if (closeRef.current) {
                    $(closeRef.current).trigger('click')
                }
            })
            .catch(err => { setError("Error in crearing group"); console.log(err) })
    }

    return (
        <nav className='chatListcontainer'>
            <div className='chatlistheader'>
                <h4 className='mychatstitle'>My Chats</h4>
                <button type="button" className="creategroupbtn btn btn-light" data-toggle="modal" data-target="#exampleModal">
                    Create Group
                </button>
            </div>
            <div className="list-group">
                {
                    [...mychats].map(chat => {
                        return <div className="list-group-item list-group-item-action chats" key={chat._id} onClick={() => handleChatClick(chat)}>
                            {
                                chat.isGroupChat ? <p>{chat.chatName}</p> : chat.users[0]._id === user._id ? <p>{chat.users[1].name}</p> : <p>{chat.users[0].name}</p>
                            }
                            {<p className='chatlistMessage'>{chat.latestMessage.user===user.name?'You':chat.latestMessage.user}: {chat.latestMessage.text}</p>}
                        </div>
                    })
                }
            </div>
            <div className="modal fade" id="exampleModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">Select Members</h5>
                            <button type="button" className="close" data-dismiss="modal" ref={closeRef} aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div>
                            <label htmlFor='groupname' className='groupnamelabel text-primary'>Group Name : </label>
                            <input type="text"
                                name="groupname"
                                value={groupName}
                                className='m-1 rounded'
                                onChange={e => setGroupName(e.target.value)} />
                            {
                                error && <label className='text-danger'>{error}</label>
                            }
                        </div>
                        {
                            nonGroupChats.map(chat => {
                                return <div className="input-group" key={chat._id}>
                                    <div className="input-group-prepend w-100">
                                        <div className="input-group-text">
                                            <input
                                                type="checkbox"
                                                className='addtogroupchecklist'
                                                name={chat.users[0]._id === user._id ? chat.users[1]._id : chat.users[0]._id}
                                                onChange={handleCheckBoxClick} 
                                                checked={selectedUsers[chat.users[0]._id === user._id ? chat.users[1]._id : chat.users[0]._id]}
                                                />
                                            {chat.users[0]._id === user._id ? chat.users[1].name : chat.users[0].name}
                                        </div>
                                    </div>
                                </div>
                            })
                        }
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                            <button type="button" className="btn btn-primary" onClick={handleCreateGroup}>Create Group</button>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default ChatList;