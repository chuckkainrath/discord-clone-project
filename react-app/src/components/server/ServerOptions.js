import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useServer } from '../../context/ServerContext';
import InviteCreate from './InviteCreate';
import { socket } from './ServerBar';
import { deleteServer, getServers } from '../../store/server';
import { createChannel, deleteChannelsInServer } from '../../store/channels';
import ChannelCreate from './channel/ChannelCreate';
import { Redirect } from 'react-router';
import styles from './ServerOptions.module.css'

function ServerOptions() {
    const dispatch = useDispatch();
    const [options, toggleOptions] = useState(false)
    const [channelCreate, toggleChannelCreate] = useState(false)
    const [inviteCreate, toggleInviteCreate] = useState(false);
    const { serverId, setServerId } = useServer();
    const userId = useSelector(state => state.session.user.id)

    const channels = useSelector(state => state.channels.channels);
    const servers = useSelector(state => state.servers.servers);

    const deleteAServer = async () => {
        // await dispatch(deleteServer(serverId))
        socket.emit('delete_server', {
            userId,
            serverId
        });
        // const channelIds = [];
        // for (const channelId in channels) {
        //     if (channels[channelId].server_id === serverId) {
        //         channelIds.push(channelId);
        //     }
        // }
        // dispatch(deleteChannelsInServer(serverId))

        // Delete channels data in store and messages

        // Change server context to another server if there is another
        // Otherwise display something
    }

    let serverName;
    if (servers[serverId]) {
        serverName = servers[serverId].name
    }

    return (
        <>
            {servers[serverId] ? <div
                onClick={() => toggleOptions(!options)}
            >
                <div className={styles.server_name}>
                    {serverName}
                </div>
            </div> : null}
            {options &&
                <div className={styles.server_options__container}>
                    <div
                        className={styles.selects}
                        onClick={() => toggleChannelCreate(!channelCreate)}
                    >
                        +Channel
                    </div>
                    {channelCreate && <ChannelCreate toggleChannelCreate={toggleChannelCreate} />}
                    <div
                        className={styles.selects}
                        onClick={() => toggleInviteCreate(!inviteCreate)}
                    >
                        +User
                    </div>
                    {inviteCreate && <InviteCreate toggleInviteCreate={toggleInviteCreate} />}
                    <div
                        className={styles.selects}
                        onClick={deleteAServer}
                    >
                        -Server
                    </div>
                </div>}
        </>
    )
}

export default ServerOptions
