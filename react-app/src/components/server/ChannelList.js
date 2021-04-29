import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useServer } from '../../context/ServerContext'
import { getChannels } from '../../store/channels'
import { useChannel } from '../../context/ChannelContext';
import { socket } from '../server/ServerBar';
import { createChannelAction } from '../../store/channels';

function filterChannels(channels, serverId) {
    return channels.filter(channel => {
        return channel.server_id == serverId
    })
}

function ChannelList() {
    const dispatch = useDispatch();
    const { serverId } = useServer();
    const { setChannelId } = useChannel();

    const channels = useSelector(state => state.channels.channels)
    const filteredChannels = filterChannels(Object.values(channels), serverId)
    const [channelVals, setChannelVals] = useState(filteredChannels)
    // const channelVals = Object.values(channels)

    useEffect(async () => {
        if (serverId > 0) {
            await dispatch(getChannels(serverId))
        }
    }, [serverId])

    useEffect(() => {
        socket.on("channel", (channel) => {
            const channel_obj = JSON.parse(channel);
            dispatch(createChannelAction(channel_obj));
        })
    })

    useEffect(() => {
        const filteredChannels = filterChannels(Object.values(channels), serverId)
        setChannelVals(filteredChannels)
    }, [channels, serverId])

    return (
        <>
            {!serverId ? <div>No Server</div> :
                <div>
                    {channelVals.map(channel => {
                        return (
                            <div
                                onClick={() => setChannelId(channel.id)}
                                key={channel.id}>
                                {channel.name}
                            </div>
                        )
                    })}
                </div>}
        </>
    )
}

export default ChannelList
