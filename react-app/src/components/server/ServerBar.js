import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getServers } from '../../store/server';
import ServerCreate from './ServerCreate'

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
        <div>
            {serversArr.map(server => {
                return (
                    <div>
                        {server.name}
                    </div>
                )
            })}
            <div onClick={() => toggleCreate(!create)}>+</div>
            {create && <ServerCreate toggleCreate={toggleCreate} />}
        </div>
    )
    // return (
    //     <div>yes</div>
    // )
}

export default ServerBar