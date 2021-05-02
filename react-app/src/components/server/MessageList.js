import React, { useEffect, useState } from 'react'
import Message from '../message/Message'
import { useParams } from 'react-router-dom';
import { useChannel } from '../../context/ChannelContext';
import { useSelector, useDispatch } from 'react-redux';
import { getMessages } from '../../store/messages'
import styles from './MessageList.module.css'

function MessageList() {
    const dispatch = useDispatch()
    const channels = useSelector(state => state.channels.channels);
    const { channelId } = useChannel();
    const { serverId } = useParams();
    const [channel, setChannel] = useState(channels[channelId])
    useEffect(() => {
        (async () => {
            if (channelId) {
                await dispatch(getMessages(serverId, channelId))
                setChannel(channels[channelId])
            }
        })();
    }, [channelId])

    return (
        <>
            <div
                className={styles.channel_name}
            >{channel && `Channel: ${channel.name}, ${channel.id}`}</div>
            <Message />
        </>
    )
}

export default MessageList
