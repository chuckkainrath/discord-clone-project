import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux'
import { useServer } from '../../context/ServerContext'
import { useChannel } from '../../context/ChannelContext';
import { deleteServerAction } from '../../store/server';
import { deleteChannelsInServer } from '../../store/channels';
import { removeMemberAction } from '../../store/members';
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
    const channels = useSelector(state => state.channels.channels);
    const [create, toggleCreate] = useState(false)

    const { serverId, setServerId } = useServer();
    const { setChannelId } = useChannel();

    const serversArr = [];
    const serverIds = [];

    for (const key in servers) {
        serversArr.push(servers[key])
        serverIds.push(key)
    }


    useEffect(() => {
        socket = io()
        socket.emit("join", { serverIds })

        socket.on('delete_server', (data) => {
            dispatch(deleteServerAction(data.server_id))
            const channelIds = [];
            for (const channelId in channels) {
                if (channels[channelId].server_id === serverId) {
                    channelIds.push(channelId);
                }
            }
            dispatch(deleteChannelsInServer(data.server_id))
            if (serverId === data.server_id) {
                history.push('/servers')
            }
        });

        socket.on('leave_server', (data) => {
            if (data.user_id === userId) {
                console.log('DATA.USER_ID', data.user_id);
                dispatch(deleteServerAction(data.server_id));
                if (serverId === data.server_id) {
                    history.push('/servers');
                }
            } else {
                dispatch(removeMemberAction(data.user_id))
            }
        });

        return (() => {
            socket.emit("leave", { serverIds })
            socket.disconnect()
        })
    }, [])

    const changeContext = serverId => {
        setServerId(serverId);
        let channelId;
        for (let channelKey in channels) {
            let currChannel = channels[channelKey]
            if (currChannel.server_id === serverId && currChannel.name === 'General') {
                channelId = channelKey;
                break;
            }
        }
        setChannelId(channelId);
    }
    return loaded && (
        <div className={styles.server_icon__container}>
            {serversArr.map(server => {
                return (
                    <ServerIcon
                        key={server.id}
                        server={server}
                    />
                )
            })}
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
