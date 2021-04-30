import React, { useEffect } from 'react'
import ServerNavBar from './ServerNavBar'
import ChannelList from './ChannelList'
import ProfileBar from './ProfileBar'
import MessageList from './MessageList'
import MembersList from './MembersList'
import ServerOptions from './ServerOptions'
import styles from './Server.module.css'
import { useServer } from '../../context/ServerContext'
import { useSelector } from 'react-redux'
import { useChannel } from '../../context/ChannelContext'

function Server() {
    const { serverId, setServerId } = useServer();
    const { channelId, setChannelId } = useChannel();

    const servers = useSelector(state => state.servers.servers)
    const channels = useSelector(state => state.channels.channels);

    const serversArr = []
    if (servers) {
        for (const key in servers) {
            serversArr.push(servers[key])
        }
    }

    useEffect(() => {
        if (serversArr.length) {
            setServerId(serversArr[0].id)
        }
    }, [])

    useEffect(() => {
        let channelId;
        for (let channelKey in channels) {
            let currChannel = channels[channelKey]
            if (currChannel.server_id === serverId && currChannel.name === 'General') {
                channelId = channelKey;
                break;
            }
        }
        setChannelId(channelId);
    }, [channels])

    return (
        <div>
            {serverId == 0 ? <div>Please make or join a server.</div> : <div className={styles.server_container}>
                <div className={styles.server_channels}>
                    <ServerOptions />
                    <ChannelList />
                    <ProfileBar />
                </div>
                <div className={styles.server_messages}>
                    <MessageList />
                </div>
                <div className={styles.server_members}>
                    <MembersList />
                </div>
            </div>}

        </div>
    )
}

export default Server