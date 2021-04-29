import React, { useEffect } from 'react'
import { useServer } from '../../context/ServerContext'
import { useChannel } from '../../context/ChannelContext';
import { socket } from '../server/ServerBar';
import { ContextMenu, MenuItem, ContextMenuTrigger } from 'react-contextmenu';

function ChannelItem({channel}) {
    const { setChannelId } = useChannel();
    const { serverId } = useServer();

    const handleClick = (e, data) => {
        console.log('CLICKED RIGHT');
    }

    const deleteChannel = (e, data) => {
        e.preventDefault()
        if (channel.name !== 'General') {
            socket.emit("delete_channel", { serverId, channelId: channel.id });
        }
    }

    return (
        <div>
            <ContextMenuTrigger id={channel.id.toString()}>
                <div
                    onClick={() => setChannelId(channel.id)}
                >
                    {channel.name}
                </div>
            </ContextMenuTrigger>
            <ContextMenu
                id={channel.id.toString()}>
                <MenuItem
                    data={{ action: 'edit' }}
                    onClick={handleClick}
                >
                    Edit Channel Name
                </MenuItem>
                <MenuItem divider />
                <MenuItem
                    data={{ action: 'delete' }}
                    onClick={deleteChannel}
                >
                    Delete Channel
                </MenuItem>
            </ContextMenu>
        </div>
    );
}

export default ChannelItem;
