import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useServer } from '../../context/ServerContext';
import { processInvite } from '../../store/invites';
import { addServerAction } from '../../store/server';
import { socket } from './ServerBar';

function InviteItem({invite}) {
    const dispatch = useDispatch();
    const { serverId } = useServer();


    const processInv = async (acceptInv) => {
        // dispatch processInv
        const server = await dispatch(processInvite(invite.server_id, acceptInv));
        // dispatch add server to store if accept
        if (acceptInv) {
            const servId = server.id.toString()
            socket.emit("join", { serverIds: [servId] })
            dispatch(addServerAction(server));
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
