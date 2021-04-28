import React from 'react'
import Message from '../message/Message'
import { useChannel } from '../../context/ChannelContext';
import { useSelector } from 'react-redux';

function MessageList() {
    const channels = useSelector(state => state.channels.channels);
    const { channelId } = useChannel();
    const channel = channels[channelId];

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
