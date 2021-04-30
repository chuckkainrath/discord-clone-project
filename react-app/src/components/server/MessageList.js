import React, { useEffect, useState } from 'react'
import Message from '../message/Message'
import { useChannel } from '../../context/ChannelContext';
import { useSelector, useDispatch } from 'react-redux';
import { getMessages } from '../../store/messages'
import { useServer } from '../../context/ServerContext';

function MessageList() {
    const dispatch = useDispatch()
    const channels = useSelector(state => state.channels.channels);
    const { channelId } = useChannel();
    const { serverId } = useServer();
    const [channel, setChannel] = useState(channels[channelId])

    useEffect(() => {
        (async () => {
            await dispatch(getMessages(serverId, channelId))
            setChannel(channels[channelId])
        })();
    }, [channelId])

    return (
        <>
            <div>{channel && `Channel: ${channel.name}, ${channel.id}`}</div>
            <Message />
        </>
    )
}

export default MessageList
