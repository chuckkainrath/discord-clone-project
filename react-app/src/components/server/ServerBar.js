import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useServer } from '../../context/ServerContext'
import { useChannel, userChannel } from '../../context/ChannelContext';
import { io } from 'socket.io-client'
import ServerCreate from './ServerCreate'
import styles from './ServerBar.module.css';

export let socket;

function shortenServer(name) {
    const splitName = name.split(' ');
    let initals = '';
    splitName.forEach(word => {
        initals += word[0].toUpperCase();
    });
    return initals;
}

function ServerBar() {
    const servers = useSelector(state => state.servers.servers);
    const channels = useSelector(state => state.channels.channels);

    const [create, toggleCreate] = useState(false)
    const { setServerId } = useServer();
    const { setChannelId } = useChannel();
    // serverId

    const serversArr = [];
    const serverIds = [];

    for (const key in servers) {
        serversArr.push(servers[key])
        serverIds.push(key)
    }

    useEffect(() => {
        socket = io()

        socket.emit("join", { serverIds })


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

    return (
        <div className={styles.server_icon__container}>
            {serversArr.map(server => {
                return (
                    <div
                        className={styles.server_icon}
                        onClick={() => changeContext(server.id)}
                        key={server.id}
                    >
                        {shortenServer(server.name)}
                    </div>
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
