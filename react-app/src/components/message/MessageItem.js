import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { socket } from '../../services/socket';
import { ContextMenu, MenuItem, ContextMenuTrigger } from 'react-contextmenu';
import blankProfileImg from '../images/blank-profile-img.png';
import Popup from 'reactjs-popup';
import styles from './MessageItem.module.css'

const formatDay = (month, day, year) => {
    let date = '';
    month++;
    if (month < 10) date += '0' + month + '/';
    else date += month + '/';
    if (day < 10) date += '0' + day + '/';
    else date += day + '/';
    date += year;
    return date;
}

const formatCurrDay = (hour, minute) => {
    let date = '';
    let suffix;
    if (hour === 0) {
        date += '12:';
        suffix = ' AM';
    } else if (hour < 12) {
        date += hour + ':';
        suffix = ' AM';
    } else if (hour === 12) {
        date += hour + ':';
        suffix = ' PM';
    } else {
        date += (hour - 12) + ':';
        suffix = ' PM';
    }
    if (minute === 0) date += '00';
    else if (minute < 10) date += '0' + minute;
    else date += minute;
    return date + suffix;
}

const formatDate = date => {
    let currentTime = new Date();
    let postedTime = new Date(date);
    let dateStr;
    let currYear = currentTime.getFullYear();
    let postYear = postedTime.getFullYear();
    let currMonth = currentTime.getMonth();
    let postMonth = postedTime.getMonth();
    let currDay = currentTime.getDate();
    let postDay = postedTime.getDate();
    if (currYear === postYear && currMonth === postMonth) {
        if (currDay === postDay) {
            dateStr = 'Today at ';
        } else if (currDay === postDay + 1) {
            dateStr = 'Yesterday at ';
        } else {
            return formatDay(postMonth, postDay, postYear);
        }
        return dateStr + formatCurrDay(postedTime.getHours(), postedTime.getMinutes());
    }
    return formatDay(postMonth, postDay, postYear);
}

function MessageItem({ message }) {
    const userId = useSelector(store => store.session.user.id);
    const [displayEdit, setDisplayEdit] = useState(false);
    const [messageBody, setMessageBody] = useState(message.body);
    const [validMessage, setValidMessage] = useState(true);
    const [messageDate, _] = useState(formatDate(message.created_at));
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
                        <div className={styles.message__wrapper}>
                            <div className={styles.img__container}>
                                <img
                                    className={styles.profile__image}
                                    src={message.profile_img_url ? message.profile_img_url : blankProfileImg} />
                            </div>
                            <div className={styles.message__container}>
                                <p className={styles.user__container}>
                                    <span className={styles.user}>{message.username}</span>
                                    <span className={styles.date}>{messageDate}</span>
                                </p>
                                <p className={styles.msg__container}><span className={styles.message}>{message.body}</span></p>
                            </div>
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
                <div className={styles.message__wrapper}>
                    <div className={styles.img__container}>
                        <img
                            className={styles.profile__image}
                            src={message.profile_img_url ? message.profile_img_url : blankProfileImg} />
                    </div>
                    <div className={styles.message__container}>
                        <p className={styles.user__container}>
                            <span className={styles.user}>{message.username}</span>
                            <span className={styles.date}>{messageDate}</span>
                        </p>
                        <p className={styles.msg__container}><span className={styles.message}>{message.body}</span></p>
                    </div>
                </div>
            }
        </>
    );
}

export default MessageItem;
