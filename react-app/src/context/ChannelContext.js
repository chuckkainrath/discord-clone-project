import React, { createContext, useState, useContext } from 'react';
import { useSelector } from 'react-redux';

export const ChannelContext = createContext();
export const useChannel = () => useContext(ChannelContext);

export default function ChannelProvider(props) {
    const channels = useSelector(state => state.channels.channels);

    const channelKey = Object.keys(channels)[0]
    const channelState = channelKey ? channelKey : 0;
    const [channelId, setChannelId] = useState(channelState)
    return (
        <ChannelContext.Provider
            value={{
                channelId,
                setChannelId
            }}
        >
            {props.children}
        </ChannelContext.Provider>
    )
}
