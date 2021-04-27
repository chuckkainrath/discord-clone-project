import { createContext, useState, useContext} from 'react';
import { useSelector } from 'react-redux';

export const ServerContext = createContext();
export const useServer = () => useContext(ServerContext);

export default function ServerProvider(props) {
    const servers = useSelector(state => state.servers);
    const [serverId, setServerId] = useState(servers.keys()[0])

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
