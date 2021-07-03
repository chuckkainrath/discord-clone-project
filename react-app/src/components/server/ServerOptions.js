import React, { useEffect, useState, useRef } from 'react'
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import InviteCreate from './InviteCreate';
import { socket } from '../../services/socket';
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

    // useEffect(() => {
    //     let clickOutside = function(e) {
    //         let servOptions = document.getElementById('server-options');
    //         let servCont = document.getElementById('server-container');
    //         if (options && servOptions && !servOptions.contains(e.target)) {
    //             toggleOptions(false);
    //             console.log('hiding menu');
    //         }
    //         else if (servCont && servCont.contains(e.target)) {
    //             toggleOptions(!options);
    //         }
    //     }
    //     if (options) {
    //         console.log('eveeveeventlasdf');
    //         document.addEventListener('click', clickOutside);
    //     } else {
    //         console.log('OPTIONS FALSE');
    //     }
    //     return () => {
    //         document.removeEventListener('click', clickOutside);
    //     }
    // }, [options]);

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
    }, [serverId])

    const toggleAllOptions = () => {
        if (options) {
            toggleChannelCreate(false);
            toggleServerEdit(false);
            toggleInviteCreate(false);
        }
        toggleOptions(!options);
    }

    return (
        <>
            {servers[serverId] ? <div
                id='server-container'
                onClick={toggleAllOptions}
            >
                <div className={styles.server_container}>
                    {server && server.name}
                    {!options &&
                        <span className={styles.server_cog_closed}>
                            <i className="fas fa-chevron-down"></i>
                        </span>
                    }
                    {options &&
                        <span className={styles.server_cog_open}>
                            <i className="far fa-times"></i>
                        </span>
                    }
                </div>
            </div> : null}
            {options &&
                <div id='server-options' className={styles.server_options__container}>
                    {server.owner_id === userId &&
                        <>
                            <div
                                className={styles.selects}
                                onClick={() => toggleServerEdit(!serverEdit)}
                            >
                                Edit Server Name
                            </div>
                            {serverEdit && <ServerEdit toggleServerEdit={toggleServerEdit} toggleOptions={toggleOptions} name={server.name} />}
                        </>
                    }
                    <div
                        className={styles.selects}
                        onClick={() => toggleChannelCreate(!channelCreate)}
                    >
                        Create a Channel
                    </div>
                    {channelCreate && <ChannelCreate toggleChannelCreate={toggleChannelCreate} toggleOptions={toggleOptions} />}
                    <div
                        className={styles.selects}
                        onClick={() => toggleInviteCreate(!inviteCreate)}
                    >
                        Invite a User
                    </div>
                    {inviteCreate && <InviteCreate toggleInviteCreate={toggleInviteCreate} toggleOptions={toggleOptions} />}
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
