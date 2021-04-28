import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { io } from 'socket.io-client';
import {useServer} from '../../context/ServerContext'
import { socket }from '../server/ServerBar'
import { useChannel } from '../../context/ChannelContext';
import { createMessageAction } from '../../store/messages';

function Message() {
    const dispatch = useDispatch();
    const [chatInput, setChatInput] = useState("");
    const [messages, setMessages] = useState([]);
    const { channelId } = useChannel();

    const user = useSelector(state => state.session.user)
    const {serverId} = useServer()

    useEffect(() => {
        socket.on("chat", (chat) => {
            const chat_obj = JSON.parse(chat);
            setMessages(messages => [...messages, chat_obj])
            dispatch(createMessageAction(chat_obj));
        })
    }, [])

    const updateChatInput = (e) => {
        setChatInput(e.target.value)
    };

    const sendChat = (e) => {
        e.preventDefault()
        console.log('serverIdSendingMessage: ', serverId);
        socket.emit("new_message", { user: user.username, // Logged in user
                                     userId: user.id,
                                     msg: chatInput,      // User's message
                                     serverId,            // Server message is in
                                     channelId });        // Channel message is in
        setChatInput("")
    }

    return (user && (
        <>
            <div>
                {messages.map((message, ind) => (
                    <div key={ind}>{`${message.user_id}: ${message.body}`}</div>
                ))}
            </div>
            <form onSubmit={sendChat}>
                <input
                    value={chatInput}
                    onChange={updateChatInput}
                />
                <button type="submit">Send</button>
            </form>
        </>)
    )
}

export default Message
