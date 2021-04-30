import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useServer } from '../../context/ServerContext'
import { getChannels } from '../../store/channels'
import { useChannel } from '../../context/ChannelContext';
import { socket } from '../server/ServerBar';
import { createChannelAction,
         deleteChannelAction,
         editChannelAction } from '../../store/channels';
import { deleteMessagesInChannel } from '../../store/messages';
import ChannelItem from './ChannelItem';

function filterChannels(channels, serverId) {
    console.log('Filtering channels', channels);
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
    const [changeChannelContext, setChangeChannelContext] = useState(false);

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
        socket.on("delete_channel", (channel) => {
            dispatch(deleteChannelAction(channel.channel_id));
            dispatch(deleteMessagesInChannel(channel.channel_id));
            setChangeChannelContext(!changeChannelContext);
        });
        socket.on("edit_channel", (channel) => {
            console.log('EDIT_CHANNEL_SOCKET_RESPONSE', channel)
            dispatch(editChannelAction(channel.channel_id, channel.name));
        })
    }, [])

    useEffect(() => {
        const allChannels = Object.values(channels);
        let genChatId;
        allChannels.forEach(channel => {
            if (channel.server_id === serverId && channel.name === 'General') {
                genChatId = channel.id;
            }
        })
        setChannelId(genChatId);
    }, [changeChannelContext]);

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
                            <ChannelItem
                                key={channel.id}
                                channel={channel}
                            />
                        )
                    })}
                </div>}
        </>
    )
}

export default ChannelList
