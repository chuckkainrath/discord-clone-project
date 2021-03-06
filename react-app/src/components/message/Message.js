import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { socket } from '../../services/socket';
import { useChannel } from '../../context/ChannelContext';
import {
    createMessageAction,
    deleteMessageAction,
    editMessageAction
} from '../../store/messages';
import MessageItem from './MessageItem';
import styles from './Message.module.css';
import { useParams } from 'react-router-dom';

function Message() {
    const dispatch = useDispatch();
    const [chatInput, setChatInput] = useState("");
    const [messages, setMessages] = useState([]);
    const [chatValid, toggleChatValid] = useState(false)
    const [ scrolled, setScrolled ] = useState(false);
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
        return () => {
            socket.removeAllListeners('chat');
            socket.removeAllListeners('edit_message');
            socket.removeAllListeners('delete_message');
        }
    }, []);

    useEffect(() => {
        let messagesDiv = document.getElementById('messages-container');
        let scrollFunc = () => setScrolled(true);
        if (messagesDiv) {
            messagesDiv.addEventListener('scroll', scrollFunc);
            if (!scrolled) messagesDiv.scrollTop = messagesDiv.scrollHeight;
            return messagesDiv.removeEventListener('scroll', scrollFunc);
        }
    }, [messages]);

    useEffect(() => {
        const channelMsgs = []
        for (let key in stateMessages) {
            const currMsg = stateMessages[key]
            if (parseInt(currMsg.channel_id) === parseInt(channelId)) {
                channelMsgs.push(currMsg)
            }
        }
        setMessages(channelMsgs)
    }, [stateMessages, channelId])

    const updateChatInput = (e) => {
        const newValue = e.target.value;
        if (newValue.charCodeAt(newValue.length - 1)  === 10) {
            if (chatValid) {
                sendChat(e);
            } else {
                setChatInput('');
            }
        } else {
            setChatInput(e.target.value)
            if (e.target.value.trim().length) {
                toggleChatValid(true)
            } else {
                toggleChatValid(false)
            }
        }
    };

    const sendChat = (e) => {
        e.preventDefault();
        socket.emit("new_message", {
            user: user.username, // Logged in user
            userId: user.id,
            msg: chatInput,      // User's message
            serverId,            // Server message is in
            channelId,           // Channel message is in
            profImgUrl: user.profile_img_url
        });
        setChatInput("")
        toggleChatValid(false)
    }

    return (user && (
        <>
            <div id='messages-container' className={styles.message_sender_container}>
                <div className={styles.message_sender}>
                    {messages.map((message, ind) => (
                        <MessageItem key={ind} message={message} />
                    ))}
                </div>
            </div>
            <div>
                <form onSubmit={sendChat} className={styles.send_chat_form}>
                    <textarea
                        value={chatInput}
                        onChange={updateChatInput}
                        className={styles.send_chat}
                    />
                    {/* <button className={styles.send_chat__button} type="submit" disabled={chatValid}>Send</button> */}
                </form>
            </div >
        </>
    ))
}

export default Message
