import React, { useState, useEffect } from 'react'
import { useParams, useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux'
import { socket } from './ServerBar';
import { useChannel } from '../../context/ChannelContext';
import { ContextMenu, MenuItem, ContextMenuTrigger } from 'react-contextmenu';
import styles from './ServerIcon.module.css'

function shortenServer(name) {
    const splitName = name.split(' ');
    let initals = '';
    splitName.forEach(word => {
        initals += word[0].toUpperCase();
    });
    return initals.substring(0,2);
}

function ServerIcon({ server }) {
    const history = useHistory();
    const userId = useSelector(state => state.session.user.id)

    const changeServer = (serverId) => {
        history.push(`/servers/${serverId}`);
    }

    const leaveServer = () => {
        // emit leave server
        if (server.owner_id !== userId) {
            socket.emit('leave_server', {
                serverId: server.id,
                userId
            });
        } else {
            // Alert user somehow
        }
    }

    return (
        <div className={styles.server_icon}>
            <ContextMenuTrigger id={server.id.toString()}>
                <div onClick={() => changeServer(server.id)}>
                    {shortenServer(server.name)}
                </div>
            </ContextMenuTrigger>
            <ContextMenu id={server.id.toString()}>
                <MenuItem
                    data={{ action: 'leave' }}
                    onClick={leaveServer}
                >
                    Leave Server
                </MenuItem>
            </ContextMenu>
            <div className={styles.server_name}>
                {server.name}
            </div>
        </div>
    )
}

export default ServerIcon;
