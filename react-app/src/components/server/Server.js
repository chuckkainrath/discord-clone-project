import React from 'react'
import ServerNavBar from './ServerNavBar'
import ChannelList from './ChannelList'
import ProfileBar from './ProfileBar'
import MessageList from './MessageList'
import MembersList from './MembersList'

function Server() {
    return (
        <div>
            <div><ServerNavBar /></div>
            <div>
                <div>
                    <ChannelList />
                    <ProfileBar />
                </div>
                <MessageList />
                <MembersList />
            </div>
        </div>
    )
}

export default Server