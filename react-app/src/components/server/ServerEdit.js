import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux';
// import { sendInvite } from '../../store/invites'
import { socket } from '../server/ServerBar';
import styles from './ServerOptions.module.css';

function ServerEdit({ toggleOptions, name }) {
    const [serverName, setServerName] = useState(name);
    const [validName, setValidName] = useState(true);
    const userId = useSelector(state => state.session.user.id);
    const { serverId } = useParams();

    useEffect(() => {
        if (serverName.length > 0 && serverName.length <= 50 && serverName !== name) {
            setValidName(false);
        } else {
            setValidName(true);
        }
    }, [serverName]);

    const submitServer = async (e) => {
        e.preventDefault();
        // const response = await sendInvite(serverId, username)
        socket.emit("edit_server", {
            name: serverName,
            serverId: serverId,
            userId: userId
        });
        setServerName('');
        setValidName(true);
        toggleOptions(false);
    }

    return (
        <form onSubmit={submitServer}>
            <div className={styles.create_invite}>
                <label>Server Name: </label>
                <input
                    type='text'
                    value={serverName}
                    onChange={(e) => setServerName(e.target.value)}
                />
            </div>
            <button
                className={styles.create_invite__submit}
                type='submit' disabled={validName}>Change Server Name</button>
        </form>
    );
}

export default ServerEdit;
