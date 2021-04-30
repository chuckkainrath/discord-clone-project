import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useServer } from '../../context/ServerContext';
import { deleteServer, getServers } from '../../store/server';
import { createChannel, deleteChannelsInServer } from '../../store/channels';
import ChannelCreate from './channel/ChannelCreate';
import { Redirect } from 'react-router';

function ServerOptions() {
    const dispatch = useDispatch();
    const [options, toggleOptions] = useState(false)
    const [channelCreate, toggleChannelCreate] = useState(false)
    const { serverId, setServerId } = useServer();

    const channels = useSelector(state => state.channels.channels);
    const servers = useSelector(state => state.servers.servers);

    console.log(servers)
    console.log('ServerId', serverId);

    const deleteAServer = async () => {
        await dispatch(deleteServer(serverId))
        const channelIds = [];
        for (const channelId in channels) {
            if (channels[channelId].server_id === serverId) {
                channelIds.push(channelId);
            }
        }
        dispatch(deleteChannelsInServer(serverId))

        // Delete channels data in store and messages

        // Change server context to another server if there is another
        // Otherwise display something
    }

    // if (!servers) {
    //     return <Redirect to='/servers' />
    // }


    // const createAChannel = async () => {
    //     await dispatch(createChannel())
    // }

    let serverName;
    if (servers[serverId]) {
        serverName = servers[serverId].name
    }

    return (
        <>
            {servers[serverId] ? <div
                onClick={() => toggleOptions(!options)}
            >
                Server Name: {serverName}
            </div> : null}
            {options &&
                <div>
                    <div
                        onClick={() => toggleChannelCreate(!channelCreate)}
                    >
                        +Channel
                    </div>
                    {channelCreate && <ChannelCreate toggleChannelCreate={toggleChannelCreate} />}
                    <div>
                        +User
                    </div>
                    <div
                        onClick={deleteAServer}
                    >
                        -Server
                    </div>
                </div>}
        </>
    )
}

export default ServerOptions
