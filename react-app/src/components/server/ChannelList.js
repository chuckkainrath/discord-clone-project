import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useServer } from '../../context/ServerContext'
import { getChannels } from '../../store/channels'

function ChannelList() {
    const dispatch = useDispatch();
    const { serverId } = useServer();

    const channels = useSelector(state => state.channels.channels)

    const channelVals = Object.values(channels)
    console.log(channelVals)

    useEffect(async () => {
        if (serverId > 0) {
            await dispatch(getChannels(serverId))
        }
    }, [serverId])
    return (
        <>
            {!serverId ? <div>No.</div> :
                <div>
                    {channelVals.map(channel => {
                        if (channel.server_id === serverId) {
                            return (
                                <div key={channel.id}>
                                    {channel.name}
                                </div>
                            )
                        }
                        else return
                    })}
                </div>}
        </>
    )
}

export default ChannelList
