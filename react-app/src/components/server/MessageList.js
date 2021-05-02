import React, { useEffect, useState } from 'react'
import Message from '../message/Message'
import { useChannel } from '../../context/ChannelContext';
import { useSelector, useDispatch } from 'react-redux';
import { getMessages } from '../../store/messages'
import { useServer } from '../../context/ServerContext';
import styles from './MessageList.module.css'

function MessageList() {
    const dispatch = useDispatch()
    const channels = useSelector(state => state.channels.channels);
    const { channelId } = useChannel();
    const { serverId } = useServer();
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
            >{channel && `# ${channel.name}`}</div>
            <Message />
        </>
    )
}

export default MessageList
