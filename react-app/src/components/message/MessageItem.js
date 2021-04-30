import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useServer } from '../../context/ServerContext'
import { socket } from '../server/ServerBar'
import { useChannel } from '../../context/ChannelContext';
import { createMessageAction } from '../../store/messages';
import { ContextMenu, MenuItem, ContextMenuTrigger } from 'react-contextmenu';
import Popup from 'reactjs-popup';


function MessageItem({ message }) {
    const userId = useSelector(store => store.session.user.id);
    const [displayEdit, setDisplayEdit] = useState(false);
    const [messageBody, setMessageBody] = useState(message.body);
    const [validMessage, setValidMessage] = useState(true);
    const { serverId } = useServer();

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
    }, [messageBody]);

    return (
        <>
            {usersMessage &&
                <div>
                    <ContextMenuTrigger id={message.id.toString()}>
                        <div>
                            <p>{message.username}: {message.body}</p>
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
                        <form onSubmit={submitMessageChange}>
                            <div>
                                <label>Edit Message: </label>
                                <input
                                    type='text'
                                    value={messageBody}
                                    onChange={(e) => setMessageBody(e.target.value)}
                                />
                            </div>
                            <button disabled={validMessage} type="submit">Submit Message Change</button>
                        </form>
                    </Popup>
                </div>
            }
            {!usersMessage &&
                <div>
                    <p>{message.username}: {message.body}</p>
                </div>
            }
        </>
    );
}

export default MessageItem;
