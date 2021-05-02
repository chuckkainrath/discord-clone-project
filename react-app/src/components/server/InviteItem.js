import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { processInvite } from '../../store/invites';
import { addServerAction } from '../../store/server';
import { socket } from './ServerBar';

function InviteItem({invite}) {
    const dispatch = useDispatch();
    const user = useSelector(state => state.session.user);
    const processInv = async (acceptInv) => {
        const servId = invite.server_id.toString()
        if (acceptInv) { // Join via sockets
            socket.emit('join_server', {
                userId: user.id,
                username: user.username,
                serverId: servId
            });
        } else { // Decline via api route
            // dispatch processInv
            await dispatch(processInvite(invite.server_id, acceptInv));
        }
    }

    return (
        <li>
            <div>{invite.server_name}</div>
            <div>
                <i onClick={() => processInv(true)} class="fal fa-check"></i>
                <span>    </span>
                <i onClick={() => processInv(false)} class="fal fa-times"></i>
            </div>
        </li>
    );
}

export default InviteItem;
