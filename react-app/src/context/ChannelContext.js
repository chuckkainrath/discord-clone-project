import React, { createContext, useState, useContext } from 'react';

export const ChannelContext = createContext();
export const useChannel = () => useContext(ChannelContext);

export default function ChannelProvider(props) {
    const [channelId, setChannelId] = useState()
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
