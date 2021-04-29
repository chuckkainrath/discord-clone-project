import React, { createContext, useState, useContext } from 'react';
import { useSelector } from 'react-redux';

export const ServerContext = createContext();
export const useServer = () => useContext(ServerContext);

export default function ServerProvider(props) {
    const servers = useSelector(state => state.servers.servers);

    // TODO: server state
    const serverKey = Object.keys(servers)[0]
    //console.log('serverKey', serverKey);
    const serverState = serverKey ? serverKey : 0;
    //console.log('serverState', serverState);
    const [serverId, setServerId] = useState(serverState)
    //console.log('serverId', serverId)
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
