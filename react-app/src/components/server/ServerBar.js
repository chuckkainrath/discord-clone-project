import React, { useState, useEffect, useRef } from 'react'
import { useHistory, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux'
import { deleteServerAction, addServerAction, editServerAction } from '../../store/server';
import { deleteChannelsInServer } from '../../store/channels';
import { removeMemberAction, addMemberAction } from '../../store/members';
import { removeInviteAction } from '../../store/invites';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import ServerCreate from './ServerCreate'
import styles from './ServerBar.module.css';
import ServerIcon from './ServerIcon';
import { socket } from '../../services/socket';

function ServerBar({ loaded }) {
    const dispatch = useDispatch();
    const history = useHistory();
    const servers = useSelector(state => state.servers.servers);
    const userId = useSelector(state => state.session.user.id);
    const [create, toggleCreate] = useState(false)
    const createRef = useRef(null);
    const createBtnRef = useRef(null);

    const { serverId } = useParams();
    const [serversArr, setServersArr] = useState([]);
    const [serverIds, setServersIds] = useState([]);

    useEffect(() => {
        setServersArr(Object.values(servers));
        setServersIds(Object.keys(servers));
    }, [servers])

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
        const clickOutside = async function(e) {
            if (createBtnRef.current && !createBtnRef.current.contains(e.target) &&
                create && createRef.current && !createRef.current.contains(e.target)) {
                toggleCreate(false);
            }
        }
        document.addEventListener('click', clickOutside);
        return () => {
            document.removeEventListener('click', clickOutside);
        }
    }, [createRef, createBtnRef, create]);

    useEffect(() => {
        socket.emit("join", { serverIds })

        return (() => {
            socket.emit("leave", { serverIds })
            // socket.disconnect()
        })
    }, [serverIds]);

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

        // This unmounts the component when the component gets un-rendered or when
        // the useEffect gets re-run due to a change in one of the items in the
        // dependecy array.
        return () => {
            socket.removeAllListeners('delete_server');
            socket.removeAllListeners('leave_server');
            socket.removeAllListeners('edit_server');
        };
    }, [servers, redirectToServer, userId])

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
        return () => {
            socket.removeAllListeners('join_server');
        }
    }, [serverId, history, userId])

    const createTooltip = props => <Tooltip id='create-server-tooltip' {...props}>Create a Server</Tooltip>

    return loaded && (
        <div className={styles.server_icon__container_invisible}>
            <>
                {serversArr.map(server => {
                    return (
                        <ServerIcon
                            key={server.id}
                            server={server}
                        />
                    )
                })}
                <OverlayTrigger
                    placement='right'
                    delay={{ show: 250, hide: 250 }}
                    overlay={createTooltip}
                >
                    <div
                        ref={createBtnRef}
                        className={styles.server_create}
                        onClick={() => toggleCreate(!create)}
                    >
                        +
                    </div>
                </OverlayTrigger>
            </>
            {create && <ServerCreate createRef={createRef} toggleCreate={toggleCreate} />}
        </div>
    )
}
export default ServerBar
