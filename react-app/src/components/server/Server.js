import React, { useEffect } from 'react'
import { Redirect, useParams, useHistory } from 'react-router-dom'
import ChannelList from './ChannelList'
import ProfileBar from './ProfileBar'
import MessageList from './MessageList'
import MembersList from './MembersList'
import ServerOptions from './ServerOptions'
import { useSelector } from 'react-redux'
import styles from './Server.module.css'

function Server() {
    const history = useHistory();
    const { serverId } = useParams();

    const user = useSelector(state => state.session.user)
    const servers = useSelector(state => state.servers.servers)

    let serversArr = []

    useEffect(() => {
        serversArr = [] // Console is throwing an error, but we want a reset of serversArr every time
        if (servers) {
            for (const key in servers) {
                serversArr.push(servers[key])
            }
        }
        if (serversArr.length) {
            const serverKeys = Object.keys(servers);
            history.push(`/servers/${serverKeys[0]}`)
        } else {
            history.push(`/servers/0`);
        }
    }, [servers])

    if (!user) {
        return <Redirect to='/' />
    }

    return (
        <>
            {Number(serverId) === 0 ?
                <>
                    <ProfileBar />
                    <div className={styles.instructions_container}>
                        <div className={styles.instructions}>Please make or join a server.</div>
                    </div>
                </>
                : <div className={styles.server_container}>
                    <div className={styles.server_channels}>
                        <div className={styles.server_channel_options__top}>
                            <div className={styles.server_options}>
                                <ServerOptions />
                            </div>
                            <ChannelList />
                        </div>
                        <ProfileBar />
                    </div>
                    <div className={styles.server_messages}>
                        <MessageList />
                    </div>
                    <div className={styles.server_members}>
                        <MembersList />
                    </div>
                </div>}

        </>
    )
}

export default Server
