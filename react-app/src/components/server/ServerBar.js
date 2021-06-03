import React, { useState, useEffect } from 'react'
import { useHistory, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux'
import { deleteServerAction, addServerAction, editServerAction } from '../../store/server';
import { deleteChannelsInServer } from '../../store/channels';
import { removeMemberAction, addMemberAction } from '../../store/members';
import { removeInviteAction } from '../../store/invites';
import { io } from 'socket.io-client'
import ServerCreate from './ServerCreate'
import styles from './ServerBar.module.css';
import ServerIcon from './ServerIcon';

export let socket;

function ServerBar({ loaded }) {
    const dispatch = useDispatch();
    const history = useHistory();
    const servers = useSelector(state => state.servers.servers);
    const userId = useSelector(state => state.session.user.id);
    const [create, toggleCreate] = useState(false)

    const { serverId } = useParams();
    const serversArr = [];
    const serverIds = [];

    for (const key in servers) {
        serversArr.push(servers[key])
        serverIds.push(key)
    }

    const redirectToServer = (rmServId) => {
        if (parseInt(serverId) === parseInt(rmServId)) {
            const servKeys = Object.keys(servers);
            let newServ = servKeys[0];
            if (newServ && newServ !== rmServId) {
                history.push(`/servers/${newServ}`)
            }
            newServ = servKeys[1];
            if (newServ) {
                history.push(`/servers/${newServ}`)
            } else {
                history.push('/servers/0')
            }
        }
    }

    useEffect(() => {
        socket = io()
        socket.emit("join", { serverIds })

        return (() => {
            socket.emit("leave", { serverIds })
            socket.disconnect()
        })
    }, []); // Ignore this error

    useEffect(() => {
        socket.on('delete_server', (data) => {
            dispatch(deleteServerAction(data.server_id))
            dispatch(deleteChannelsInServer(data.server_id))
            redirectToServer(data.server_id);
        });

        socket.on('leave_server', (data) => {
            if (data.user_id === userId) {
                dispatch(deleteServerAction(data.server_id));
                redirectToServer(data.server_id)
            } else {
                dispatch(removeMemberAction(data.user_id))
            }
        });

        socket.on('edit_server', (data) => {
            dispatch(editServerAction(data.server_id, data.name))
        })
    }, [servers, dispatch, redirectToServer, userId])

    useEffect(() => {
        socket.on('join_server', (data) => {
            const server = data.server;
            if (parseInt(userId) === parseInt(data.userId)) {
                dispatch(addServerAction(server));
                dispatch(removeInviteAction(server.id))
                history.push(`/servers/${server.id}`)
            } else if (parseInt(server.id) === parseInt(serverId)) {
                dispatch(addMemberAction(data.userId, data.username))
            }
        })
    }, [serverId, dispatch, history, userId])

    return loaded && (
        <div className={styles.server_icon__container_invisible}>
            <div className={styles.server_icon__container}>
                {serversArr.map(server => {
                    return (
                        <ServerIcon
                            key={server.id}
                            server={server}
                        />
                    )
                })}
            </div>
            <div
                className={styles.server_create}
                onClick={() => toggleCreate(!create)}
            >
                +
            </div>
            {create && <ServerCreate toggleCreate={toggleCreate} />}
        </div>
    )
}
export default ServerBar
