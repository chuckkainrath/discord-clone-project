import React, { useEffect } from 'react'
import Message from '../message/Message'
import { useChannel } from '../../context/ChannelContext';
import { useSelector, useDispatch } from 'react-redux';
import { getMessages } from '../../store/messages'
import { useServer } from '../../context/ServerContext';

function MessageList() {
    const dispatch = useDispatch()
    const channels = useSelector(state => state.channels.channels);
    const { channelId } = useChannel();
    const { serverId } = useServer()
    const channel = channels[channelId];

    useEffect(() => {
     (async () => {
         await dispatch(getMessages(serverId, channelId))
     })();   
    }, [channelId])

    return (
        <>
            <div>{channel && `Channel: ${channel.name}, ${channel.id}`}</div>
            {/* <div>Message List</div>
            <div>Send Messages</div> */}
            <Message />
        </>
    )
}

export default MessageList
