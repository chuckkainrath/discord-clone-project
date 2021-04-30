import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useServer } from '../../context/ServerContext';
import { deleteServer } from '../../store/server';
import { deleteChannelsInServer } from '../../store/channels';
import InviteCreate from './InviteCreate';
import ChannelCreate from './channel/ChannelCreate';

function ServerOptions() {
    const dispatch = useDispatch();
    const [options, toggleOptions] = useState(false)
    const [channelCreate, toggleChannelCreate] = useState(false)
    const [inviteCreate, toggleInviteCreate] = useState(false);
    const { serverId, setServerId } = useServer();

    const channels = useSelector(state => state.channels.channels);
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

    // const createAChannel = async () => {
    //     await dispatch(createChannel())
    // }

    return (
        <>
            {/* <div className={styles.server_name}>Server Name</div> */}
            <div
                onClick={() => toggleOptions(!options)}
            >
                Server Name
            </div>
            {options &&
                <div>
                    <div
                        onClick={() => toggleChannelCreate(!channelCreate)}
                    >
                        +Channel
                    </div>
                    {channelCreate && <ChannelCreate toggleChannelCreate={toggleChannelCreate} />}
                    <div
                        onClick={() => toggleInviteCreate(!inviteCreate)}
                    >
                        +User
                    </div>
                    {inviteCreate && <InviteCreate toggleInviteCreate={toggleInviteCreate} />}
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
