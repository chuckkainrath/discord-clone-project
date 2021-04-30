import React, { useEffect, useState } from 'react'
import { useServer } from '../../context/ServerContext'
import { useChannel } from '../../context/ChannelContext';
import { socket } from '../server/ServerBar';
import { ContextMenu, MenuItem, ContextMenuTrigger } from 'react-contextmenu';
import Popup from 'reactjs-popup';

function ChannelItem({channel}) {
    const { setChannelId } = useChannel();
    const { serverId } = useServer();
    const [displayEdit, setDisplayEdit] = useState(false);
    const [channelName, setChannelName] = useState(channel.name)
    const [validName, setValidName] = useState(true)

    const handleEditClick = (e, data) => {
        console.log('CLICKED RIGHT');
        if (channel.name !== 'General') {
            setDisplayEdit(true);
        }
    }

    const deleteChannel = (e, data) => {
        e.preventDefault()
        if (channel.name !== 'General') {
            socket.emit("delete_channel", { serverId, channelId: channel.id });
        }
    }

    useEffect(() => {
        if (channelName === channel.name
            || channelName.length === 0
            || channelName.length > 50) {
            setValidName(true);
        } else {
            setValidName(false);
        }
    }, [channelName]);


    const submitNameChange = () => {
        socket.emit('edit_channel', {
            serverId,
            channelId: channel.id,
            name: channelName
        });
        setDisplayEdit(false);
        setValidName(true);
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
                    onClick={handleEditClick}
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
            <Popup open={displayEdit} onClose={() => setDisplayEdit(false)}>
                <form onSubmit={submitNameChange}>
                    <div>
                        <label>Edit Channel Name: </label>
                        <input
                            type='text'
                            value={channelName}
                            onChange={(e) => setChannelName(e.target.value)}
                        />
                    </div>
                    <button disabled={validName} type="submit">Submit Name Change</button>
                </form>
            </Popup>
        </div>
    );
}

export default ChannelItem;
