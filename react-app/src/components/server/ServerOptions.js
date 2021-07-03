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
    const optionsRef = useRef(null);
    const optionsBtnRef = useRef(null);
    const userId = useSelector(state => state.session.user.id)
    const servers = useSelector(state => state.servers.servers);

    useEffect(() => {
        const clickOutside = async function(e) {
            if (optionsBtnRef.current && !optionsBtnRef.current.contains(e.target) &&
                options && optionsRef.current && !optionsRef.current.contains(e.target)) {
                toggleOptions(false);
                toggleChannelCreate(false);
                toggleInviteCreate(false);
                toggleServerEdit(false);
            }
        }
        document.addEventListener('click', clickOutside);
        return () => {
            document.removeEventListener('click', clickOutside);
        }
    }, [optionsRef, optionsBtnRef, options]);

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

    const toggleServerFunc = () => {
        toggleServerEdit(!serverEdit);
        toggleInviteCreate(false);
        toggleChannelCreate(false);
    }

    const toggleChannelFunc = () => {
        toggleChannelCreate(!channelCreate);
        toggleInviteCreate(false);
        toggleServerEdit(false);
    }

    const toggleInviteFunc = () => {
        toggleChannelCreate(false);
        toggleInviteCreate(!inviteCreate);
        toggleServerEdit(false);
    }

    return (
        <>
            {servers[serverId] ? <div
                ref={optionsBtnRef}
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
                <div ref={optionsRef} className={styles.server_options__container}>
                    {server.owner_id === userId &&
                        <>
                            <div
                                className={styles.selects}
                                onClick={toggleServerFunc}
                            >
                                Edit Server Name
                            </div>
                            {serverEdit && <ServerEdit toggleServerEdit={toggleServerEdit} toggleOptions={toggleOptions} name={server.name} />}
                        </>
                    }
                    <div
                        className={styles.selects}
                        onClick={toggleChannelFunc}
                    >
                        Create a Channel
                    </div>
                    {channelCreate && <ChannelCreate toggleChannelCreate={toggleChannelCreate} toggleOptions={toggleOptions} />}
                    <div
                        className={styles.selects}
                        onClick={toggleInviteFunc}
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
