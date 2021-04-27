import React, { createContext, useState, useContext } from 'react';
import { useSelector } from 'react-redux';

export const ServerContext = createContext();
export const useServer = () => useContext(ServerContext);

export default function ServerProvider(props) {
    const servers = useSelector(state => state.servers.servers);

    const serverKey = Object.keys(servers)[0]
    const serverState = serverKey ? serverKey : 0;
    const [serverId, setServerId] = useState(serverState)

    return (
        <ServerContext.Provider
            value={{
                serverId,
                setServerId
            }}
        >
            {props.children}
        </ServerContext.Provider>
    )
}
