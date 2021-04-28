import React from 'react'
import ServerNavBar from './ServerNavBar'
import ChannelList from './ChannelList'
import ProfileBar from './ProfileBar'
import MessageList from './MessageList'
import MembersList from './MembersList'
import ServerOptions from './ServerOptions'
import styles from './Server.module.css'

function Server() {

    return (
        <div>

            <div className={styles.server_container}>
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
            </div>
        </div>
    )
}

export default Server