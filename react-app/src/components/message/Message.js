import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { io } from 'socket.io-client';
import { socket } from '../server/ServerBar'
import { useChannel } from '../../context/ChannelContext';
import {
    createMessageAction,
    deleteMessageAction,
    editMessageAction
} from '../../store/messages';
import MessageItem from './MessageItem';
import { useParams } from 'react-router-dom';

function Message() {
    const dispatch = useDispatch();
    const [chatInput, setChatInput] = useState("");
    const [messages, setMessages] = useState([]);
    const [chatValid, toggleChatValid] = useState(true)
    const { channelId } = useChannel();

    const user = useSelector(state => state.session.user)
    const stateMessages = useSelector(state => state.messages.messages)
    const { serverId } = useParams()

    useEffect(() => {
        socket.on("chat", (chat) => {
            const chat_obj = JSON.parse(chat);
            dispatch(createMessageAction(chat_obj));
        })
        socket.on('edit_message', (response) => {
            dispatch(editMessageAction(response.message_id, response.body))
        })
        socket.on('delete_message', (response) => {
            dispatch(deleteMessageAction(response.message_id))
        })
    }, [])

    useEffect(() => {
        const channelMsgs = []
        for (let key in stateMessages) {
            const currMsg = stateMessages[key]
            if (currMsg.channel_id == channelId) {
                channelMsgs.push(currMsg)
            }
        }
        setMessages(channelMsgs)
    }, [stateMessages])

    const updateChatInput = (e) => {
        setChatInput(e.target.value)
        if (e.target.value.length) {
            toggleChatValid(false)

        } else {
            toggleChatValid(true)
        }
    };

    const sendChat = (e) => {
        e.preventDefault()
        socket.emit("new_message", {
            user: user.username, // Logged in user
            userId: user.id,
            msg: chatInput,      // User's message
            serverId,            // Server message is in
            channelId            // Channel message is in
        });
        setChatInput("")
        toggleChatValid(true)
    }

    return (user && (
        <div>
            <div>
                {messages.map((message, ind) => (
                    <MessageItem key={ind} message={message} />
                    // <div key={ind}>{`${message.user_id}: ${message.body}`}</div>
                ))}
            </div>
            <form onSubmit={sendChat}>
                <input
                    value={chatInput}
                    onChange={updateChatInput}
                />
                <button type="submit" disabled={chatValid}>Send</button>
            </form>
        </div>)
    )
}

export default Message
