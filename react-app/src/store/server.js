import { createChannelAction } from './channels'

const GET_ALL_SERVERS = "server/GET_ALL_SERVERS"
const CREATE_SERVER = "server/CREATE_SERVER"
const DELETE_SERVER = "server/DELETE_SERVER"
const ADD_SERVER = "server/ADD_SERVER"
const EDIT_SERVER = "server/EDIT_SERVER"

const getServersAction = (servers) => ({
    type: GET_ALL_SERVERS,
    payload: servers
})

const createServerAction = (server) => ({
    type: CREATE_SERVER,
    payload: server
})

export const deleteServerAction = (server) => ({
    type: DELETE_SERVER,
    payload: server
})

export const addServerAction = (server) => ({
    type: ADD_SERVER,
    server
})

export const editServerAction = (serverId, name) => ({
    type: EDIT_SERVER,
    serverId,
    name
})

export const getServers = () => async (dispatch) => {
    const response = await fetch('/api/servers/')
    const data = await response.json();
    if (data.errors) {
        return;
    }
    dispatch(getServersAction(data.servers))
    return data.servers;
}

export const createServer = (name, description) => async (dispatch) => {
    const response = await fetch('/api/servers/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, description })
    })


    const data = await response.json();
    if (data.errors) {
        return;
    }
    dispatch(createServerAction(data.server))
    dispatch(createChannelAction(data.channel))
    return data.server.id;
}


export const deleteServer = (serverId) => async (dispatch) => {
    const response = await fetch(`api/servers/${serverId}`, {
        method: 'DELETE'
    });

    const data = await response.json();
    if (data.errors) {
        return;
    }
    dispatch(deleteServerAction(serverId))
}

const flatServers = (servers) => {
    const fServer = {}
    servers.forEach(server => {
        fServer[server.id] = server
    })
    return fServer
}

const initialState = { servers: {} }

export default function reducer(state = initialState, action) {
    let newState
    switch (action.type) {
        case GET_ALL_SERVERS:
            return { servers: flatServers(action.payload) }
        case CREATE_SERVER:
            newState = { servers: { ...state.servers } }
            newState.servers[action.payload.id] = action.payload
            return newState
        case DELETE_SERVER:
            newState = { servers: { ...state.servers } }
            delete newState.servers[action.payload]
            return newState
        case ADD_SERVER:
            newState = { servers: { ...state.servers } }
            newState.servers[action.server.id] = action.server
            return newState;
        case EDIT_SERVER:
            newState = { servers: { ...state.servers } }
            newState.servers[action.serverId].name = action.name;
            return newState;
        default:
            return state;
    }
}
