// import { useSelector } from 'react-redux';
//import { deleteMessagesInChannels } from './messages'

const GET_ALL_CHANNELS = "channel/GET_ALL_CHANNELS"
// const GET_channel = "channel/GET_channel"
const CREATE_CHANNEL = "channel/CREATE_CHANNEL"
const DELETE_CHANNEL = "channel/DELETE_CHANNEL"
//const DELETE_CHANNELS = "channel/DELETE_CHANNELS"

const getChannelsAction = (channel) => ({
    type: GET_ALL_CHANNELS,
    payload: channel
})

// export const deleteChannelsInServer = (serverId) => {
//     const channels = useSelector(state => state.channels.channels)
//     const channelIds = []
//     for (let channel in channels) {
//         if (channel.server_id === serverId) {
//             channelIds.push(channel.id)
//         }
//     }
//     dispatch(deleteMessagesInChannels(channelIds));
//     return {
//         type: DELETE_CHANNELS,
//         payload: serverId
//     }
// }

export const createChannelAction = (channel) => ({
    type: CREATE_CHANNEL,
    payload: channel
})

const deleteChannelAction = (channel) => ({
    type: DELETE_CHANNEL,
    payload: channel
})

export const getChannels = (serverId) => async (dispatch) => {
    const response = await fetch(`/api/servers/${serverId}/channels/`)

    const data = await response.json();
    if (data.errors) {
        return;
    }
    dispatch(getChannelsAction(data.channels))
}

export const createChannel = (name, serverId) => async (dispatch) => {
    const response = await fetch(`/api/servers/${serverId}/channels`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name })
    })

    const data = await response.json();
    if (data.errors) {
        return;
    }
    dispatch(createChannelAction(data.channel))
}


export const deleteChannel = (channelId, serverId) => async (dispatch) => {
    const response = await fetch(`/api/servers/${serverId}/channels/${channelId}`, {
        method: 'DELETE'
    });

    const data = await response.json();
    if (data.errors) {
        return;
    }
    dispatch(deleteChannelAction(channelId))
}

const flatChannels = (channels) => {
    const fChannel = {}
    channels.forEach(channel => {
        fChannel[channel.id] = channel
    })
    return fChannel
}

const initialState = { channels: {} }

export default function reducer(state = initialState, action) {
    let newState
    switch (action.type) {
        case GET_ALL_CHANNELS:
            return { channels: flatChannels(action.payload) }
        case CREATE_CHANNEL:
            newState = { channels: { ...state.channels } }
            newState.channels[action.payload.id] = action.payload
            return newState
        case DELETE_CHANNEL:
            newState = { channels: { ...state.channels } }
            delete newState.channels[action.payload]
            return newState
        // case DELETE_CHANNELS:
        //     newState = { channels: { ...state.channels } }
        //     // action.payload === serverId
        //     for (let channel in newState.channels) {
        //         if (channel.server_id === action.payload) {
        //             delete newState.channels[channel.id]
        //         }
        //     }
        //     return newState;
        default:
            return state;
    }
}
