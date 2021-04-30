import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useServer } from '../../../context/ServerContext'
import { createChannel } from '../../../store/channels';
import { socket } from '../../server/ServerBar';

function ChannelCreate({ toggleChannelCreate }) {
    const dispatch = useDispatch();

    const [validChannel, toggleValidChannel] = useState(true)
    const [channelName, setChannelName] = useState('')
    const { serverId } = useServer();

    useEffect(() => {
        if (channelName.length > 0 && channelName.length <= 50) {
            toggleValidChannel(false)
        }
        else {
            toggleValidChannel(true)
        }
    }, [channelName])

    const submitChannel = async (e) => {
        e.preventDefault()
        // await dispatch(createChannel(channelName, serverId))
        socket.emit("new_channel", {
            name: channelName,
            serverId: serverId
        });
        toggleChannelCreate(false)
        toggleValidChannel(true)
        setChannelName('')
    }

    return (
        <form onSubmit={submitChannel}>
            <div>
                <label>Channel Name: </label>
                <input
                    type='text'
                    value={channelName}
                    onChange={e => setChannelName(e.target.value)}
                />
            </div>
            <div>
                <button disabled={validChannel} type='submit'>Submit</button>
            </div>
        </form>
    )
}

export default ChannelCreate
