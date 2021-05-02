import React, { useState } from 'react'
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import InviteCreate from './InviteCreate';
import { socket } from './ServerBar';
import ChannelCreate from './channel/ChannelCreate';
import styles from './ServerOptions.module.css'

function ServerOptions() {
    const { serverId } = useParams();
    const [options, toggleOptions] = useState(false)
    const [channelCreate, toggleChannelCreate] = useState(false)
    const [inviteCreate, toggleInviteCreate] = useState(false);
    const userId = useSelector(state => state.session.user.id)

    const servers = useSelector(state => state.servers.servers);

    const deleteAServer = async () => {
        toggleOptions(false);
        socket.emit('delete_server', {
            userId,
            serverId
        });
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
                <div>
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
                    {channelCreate && <ChannelCreate toggleOptions={toggleOptions} />}
                    <div
                        className={styles.selects}
                        onClick={() => toggleInviteCreate(!inviteCreate)}
                    >
                        +User
                    </div>
                    {inviteCreate && <InviteCreate toggleOptions={toggleOptions} />}
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
