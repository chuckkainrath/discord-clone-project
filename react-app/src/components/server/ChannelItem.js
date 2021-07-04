import React, { useEffect, useState, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { useChannel } from '../../context/ChannelContext';
import { socket } from '../../services/socket';
import { ContextMenu, MenuItem, ContextMenuTrigger } from 'react-contextmenu';
import Popup from 'reactjs-popup';
import styles from './ChannelItem.module.css'

function ChannelItem({ channel }) {
    const { setChannelId } = useChannel();
    const { serverId } = useParams();
    const [displayEdit, setDisplayEdit] = useState(false);
    const [channelName, setChannelName] = useState(channel.name)
    const [validName, setValidName] = useState(true)
    const contextRef = useRef(null);

    const handleEditClick = (e, data) => {
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
    }, [channelName, channel.name]);


    const submitNameChange = (e) => {
        e.preventDefault();
        socket.emit('edit_channel', {
            serverId,
            channelId: channel.id,
            name: channelName
        });
        setDisplayEdit(false);
        setValidName(true);
    }

    const iconClick = e => {
        if (contextRef) contextRef.current.handleContextClick(e);
    }

    return (
        <div className={styles.channel_name_container}>
            <ContextMenuTrigger
                ref={contextRef}
                id={channel.id.toString()}>
                <div
                    className={styles.channel_name}
                    onClick={() => setChannelId(channel.id)}
                >
                    {channel.name}
                    <i
                        onClick={iconClick}
                        class="fas fa-cog">
                    </i>
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
                <div className={styles.popup_container}>
                    <form onSubmit={submitNameChange}>
                        <div className={styles.channel_edit}>
                            <label>Edit Channel Name: </label>
                            <input
                                type='text'
                                value={channelName}
                                onChange={(e) => setChannelName(e.target.value)}
                            />
                        </div>
                        <button disabled={validName} type="submit">Submit Name Change</button>
                    </form>
                </div>
            </Popup>
        </div>
    );
}

export default ChannelItem;
