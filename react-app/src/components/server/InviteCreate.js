import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'
import { sendInvite } from '../../store/invites'
import styles from './ServerOptions.module.css';

function InviteCreate({ toggleOptions }) {
    const [username, setUsername] = useState('');
    const [validInv, setValidInv] = useState(true);
    const { serverId } = useParams();

    useEffect(() => {
        if (username.length > 0 && username.length <= 50) {
            setValidInv(false);
        } else {
            setValidInv(true);
        }
    }, [username]);

    const submitInvite = async (e) => {
        e.preventDefault();
        const response = await sendInvite(serverId, username)
        setUsername('');
        setValidInv(true);
        toggleOptions(false);
    }

    return (
        <form onSubmit={submitInvite}>
            <div className={styles.create_invite}>
                <label>Username: </label>
                <input
                    type='text'
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
            </div>
            <button
                className={styles.create_invite__submit}
                type='submit' disabled={validInv}>Send Invite</button>
        </form>
    );
}

export default InviteCreate;
