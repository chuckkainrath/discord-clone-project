import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getServers } from '../../store/server';
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
    const dispatch = useDispatch();
    const servers = useSelector(state => state.servers.servers)

    const [create, toggleCreate] = useState(false)

    const serversArr = [];

    for (const key in servers) {
        serversArr.push(servers[key])
    }
    // useEffect(async () => {
    //     const servers = await dispatch(getServers())
    // }, [])
    return (
        <div className={styles.server_icon__container}>
            {serversArr.map(server => {
                return (
                    <div className={styles.server_icon}>
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
    // return (
    //     <div>yes</div>
    // )
}

export default ServerBar
