import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'
import { sendInvite } from '../../store/invites'

function InviteCreate({toggleOptions}) {
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
        console.log(response); // Notify user of response?
        setUsername('');
        setValidInv(true);
        toggleOptions(false);
    }

    return (
        <form onSubmit={submitInvite}>
            <div>
                <label>Username: </label>
                <input
                    type='text'
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
            </div>
            <button type='submit' disabled={validInv}>Send Invite</button>
        </form>
    );
}

export default InviteCreate;
