import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom';
import { getChannels } from '../../store/channels'
import { useChannel } from '../../context/ChannelContext';
import { socket } from '../server/ServerBar';
import {
    createChannelAction,
    deleteChannelAction,
    editChannelAction
} from '../../store/channels';
import { deleteMessagesInChannel } from '../../store/messages';
import ChannelItem from './ChannelItem';
import styles from './ChannelList.module.css'

function filterChannels(channels, serverId) {
    return channels.filter(channel => {
        return channel.server_id === Number(serverId)
    })
}

function ChannelList() {
    const dispatch = useDispatch();
    const { serverId } = useParams();
    const { channelId, setChannelId } = useChannel();

    const channels = useSelector(state => state.channels.channels)
    const filteredChannels = filterChannels(Object.values(channels), serverId)
    const [channelVals, setChannelVals] = useState(filteredChannels)

    useEffect(async () => {
        const servId = parseInt(serverId);
        if (servId > 0) {
            const servChannels = await dispatch(getChannels(servId));
            for (let i = 0; i < servChannels.length; i++) {
                if (servChannels[i].name === 'General') {
                    setChannelId(servChannels[i].id);
                    break;
                }
            }
        }
    }, [serverId])

    useEffect(() => {
        const filteredChannels = filterChannels(Object.values(channels), serverId)
        setChannelVals(filteredChannels)

        socket.on("channel", (channel) => {
            const channel_obj = JSON.parse(channel);
            dispatch(createChannelAction(channel_obj));
            setChannelId(channel_obj.id);
        })
        socket.on("delete_channel", (channel) => {
            dispatch(deleteChannelAction(channel.channel_id));
            dispatch(deleteMessagesInChannel(channel.channel_id));
            changeChannelContext(channel.channel_id);
        });
        socket.on("edit_channel", (channel) => {
            dispatch(editChannelAction(channel.channel_id, channel.name));
        })
    }, [channels, serverId])

    const changeChannelContext = (rmChanId) => {
        if (channelId == rmChanId) {
            const allChannels = Object.values(channels);
            let genChatId;
            allChannels.forEach(channel => {
                if (channel.server_id == serverId && channel.name === 'General') {
                    genChatId = channel.id;
                }
            });
            setChannelId(genChatId);
        }
    }

    return (
        <>
            {!serverId ? <div>No Server</div> :
                <div className={styles.channels_container}>
                    {channelVals && channelVals.map(channel => {
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
