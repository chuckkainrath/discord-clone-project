import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { socket } from './ServerBar';
import { useServer } from '../../context/ServerContext'
import { useChannel } from '../../context/ChannelContext';
import { ContextMenu, MenuItem, ContextMenuTrigger } from 'react-contextmenu';

function shortenServer(name) {
    const splitName = name.split(' ');
    let initals = '';
    splitName.forEach(word => {
        initals += word[0].toUpperCase();
    });
    return initals;
}

function ServerIcon({server}) {
    const { serverId, setServerId } = useServer();
    const { setChannelId } = useChannel();
    const userId = useSelector(state => state.session.user.id)
    const channels = useSelector(state => state.channels.channels);

    const changeContext = serverId => {
        setServerId(serverId);
        let channelId;
        for (let channelKey in channels) {
            let currChannel = channels[channelKey]
            if (currChannel.server_id === serverId && currChannel.name === 'General') {
                channelId = channelKey;
                break;
            }
        }
        setChannelId(channelId);
    }

    const leaveServer = () => {
        // emit leave server
        console.log('LEAVING SERVER: ', server.id, server.name)
        socket.emit('leave_server', {
            serverId: server.id,
            userId
        });
    }

    return (
        <div>
            <ContextMenuTrigger id={server.id.toString()}>
                <div onClick={() => changeContext(server.id)}>
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
        </div>
    )
}

export default ServerIcon;
