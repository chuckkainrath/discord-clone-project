import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { socket } from '../../services/socket';
import { ContextMenu, MenuItem, ContextMenuTrigger } from 'react-contextmenu';
import Popup from 'reactjs-popup';
import styles from './MessageItem.module.css'


function MessageItem({ message }) {
    const userId = useSelector(store => store.session.user.id);
    const [displayEdit, setDisplayEdit] = useState(false);
    const [messageBody, setMessageBody] = useState(message.body);
    const [validMessage, setValidMessage] = useState(true);
    const { serverId } = useParams();

    const usersMessage = message.user_id === userId;

    const handleEditClick = () => {
        // toggle display popup state
        setDisplayEdit(true);
    }

    const deleteMessage = (e) => {
        e.preventDefault();
        // Do a socket emit
        socket.emit("delete_message", {
            serverId,
            messageId: message.id
        });
    }

    const submitMessageChange = (e) => {
        e.preventDefault();
        // Socket emit
        socket.emit("edit_message", {
            serverId,
            messageId: message.id,
            body: messageBody
        })
        // clean up state variables
        setValidMessage(true);
        setDisplayEdit(false);
    }

    useEffect(() => {
        if (messageBody.length > 0 && messageBody !== message.body) {
            setValidMessage(false);
        } else {
            setValidMessage(true);
        }
    }, [messageBody, message.body]);

    return (
        <>
            {usersMessage &&
                <div className={styles.messages_container}>
                    <ContextMenuTrigger id={message.id.toString()}>
                        <div>
                            <p className={styles.message_container}><span className={styles.user}>{message.username}: </span> <span className={styles.message}>{message.body}</span></p>
                        </div>
                    </ContextMenuTrigger>
                    <ContextMenu
                        id={message.id.toString()}>
                        <MenuItem
                            data={{ action: 'edit' }}
                            onClick={handleEditClick}
                        >
                            Edit Message
                        </MenuItem>
                        <MenuItem divider />
                        <MenuItem
                            data={{ action: 'delete' }}
                            onClick={deleteMessage}
                        >
                            Delete Message
                        </MenuItem>
                    </ContextMenu>
                    <Popup open={displayEdit} onClose={() => setDisplayEdit(false)}>
                        <div className={styles.popup_container}>
                            <form onSubmit={submitMessageChange} className={styles.edit_message_form}>
                                <div className={styles.edit_message}>
                                    <label>Edit Message: </label>
                                    <textarea
                                        type='text'
                                        value={messageBody}
                                        onChange={(e) => setMessageBody(e.target.value)}
                                    />
                                </div>
                                <button disabled={validMessage} type="submit">Submit Message Change</button>
                            </form>
                        </div>
                    </Popup>
                </div>
            }
            {!usersMessage &&
                <div className={styles.messages_container}>
                    <p className={styles.message_container}><span className={styles.user}>{message.username}: </span> <span className={styles.message}>{message.body}</span></p>
                </div>
            }
        </>
    );
}

export default MessageItem;
