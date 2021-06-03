import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import InviteCreate from './InviteCreate';
import { socket } from './ServerBar';
import ChannelCreate from './channel/ChannelCreate';
import ServerEdit from './ServerEdit';
import styles from './ServerOptions.module.css'

function ServerOptions() {
    const { serverId } = useParams();
    const [server, setServer] = useState();
    const [serverEdit, toggleServerEdit] = useState(false);
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

    useEffect(() => {
        if (servers[serverId]) {
            setServer(servers[serverId]);
        }
    }, [servers])

    // let serverName;
    // if (servers[serverId]) {
    //     serverName = servers[serverId].name
    // }

    return (
        <>
            {servers[serverId] ? <div
                onClick={() => toggleOptions(!options)}
            >
                <div className={styles.server_container}>
                    {server && server.name}
                    {!options &&
                        <span className={styles.server_cog_closed}>
                            <i class="fas fa-chevron-down"></i>
                        </span>
                    }
                    {options &&
                        <span className={styles.server_cog_open}>
                            <i class="far fa-times"></i>
                        </span>
                    }
                </div>
            </div> : null}
            {options &&
                <div className={styles.server_options__container}>
                    {server.owner_id === userId &&
                        <>
                            <div
                                className={styles.selects}
                                onClick={() => toggleServerEdit(!serverEdit)}
                            >
                                Edit Server Name
                            </div>
                            {serverEdit && <ServerEdit toggleOptions={toggleOptions} name={server.name} />}
                        </>
                    }
                    <div
                        className={styles.selects}
                        onClick={() => toggleChannelCreate(!channelCreate)}
                    >
                        Create a Channel
                    </div>
                    {channelCreate && <ChannelCreate toggleOptions={toggleOptions} />}
                    <div
                        className={styles.selects}
                        onClick={() => toggleInviteCreate(!inviteCreate)}
                    >
                        Invite a User
                    </div>
                    {inviteCreate && <InviteCreate toggleOptions={toggleOptions} />}
                    <div
                        className={styles.selects}
                        onClick={deleteAServer}
                    >
                        Delete Server
                    </div>
                </div>}
        </>
    )
}

export default ServerOptions
