import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useServer } from '../../context/ServerContext'
import ServerCreate from './ServerCreate'
import styles from './ServerBar.module.css';

function shortenServer(name) {
    const splitName = name.split(' ');
    let initals = '';
    splitName.forEach(word => {
        initals += word[0].toUpperCase();
    });
    return initals;
}

function ServerBar() {
    const servers = useSelector(state => state.servers.servers)

    const [create, toggleCreate] = useState(false)
    const { setServerId } = useServer();
    // serverId

    const serversArr = [];

    for (const key in servers) {
        serversArr.push(servers[key])
    }

    // useEffect(() => {
    //     console.log('NEW SERVER CONTEXT!!!', serverId)
    // }, [serverId])
    return (
        <div className={styles.server_icon__container}>
            {serversArr.map(server => {
                return (
                    <div
                        className={styles.server_icon}
                        onClick={() => setServerId(server.id)}
                        key={server.id}
                    >
                        {shortenServer(server.name)}
                    </div>
                )
            })}
            <div
                className={styles.server_create}
                onClick={() => toggleCreate(!create)}>+</div>
            {create && <ServerCreate toggleCreate={toggleCreate} />}
        </div>
    )
}

export default ServerBar
