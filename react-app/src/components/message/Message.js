import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { io } from 'socket.io-client';
import {useServer} from '../../context/ServerContext'
import { socket }from '../server/ServerBar'

function Message() {

    const [chatInput, setChatInput] = useState("");
    const [messages, setMessages] = useState([])

    const user = useSelector(state => state.session.user)
    const {serverId} = useServer()

    useEffect(() => {
        // socket = io()
        // console.log('connecting')

        // socket.emit("join", {serverId})
        socket.on("chat", (chat) => {
            setMessages(messages => [...messages, chat])
        })

        // return (() => {
        //     socket.emit("leave", {serverId})
        //     socket.disconnect()
        // })
    }, [])

    const updateChatInput = (e) => {
        setChatInput(e.target.value)
    };

    const sendChat = (e) => {
        e.preventDefault()
        console.log('serverIdSendingMessage: ', serverId);
        socket.emit("new_message", { user: user.username, msg: chatInput, serverId });
        setChatInput("")
    }

    return (user && (
        <>
            <div>
                {messages.map((message, ind) => (
                    <div key={ind}>{`${message.user}: ${message.msg}`}</div>
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
