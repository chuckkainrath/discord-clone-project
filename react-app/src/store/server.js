import cloneDeep from 'clone-deep'

const GET_ALL_SERVERS = "server/GET_ALL_SERVERS"
const GET_SERVER = "server/GET_SERVER"
const CREATE_SERVER = "server/CREATE_SERVER"

const getServersAction = (servers) => ({
    type: GET_ALL_SERVERS,
    payload: servers
})

const createServerAction = (server) => ({
    type: CREATE_SERVER,
    payload: server
})

export const getServers = () => async (dispatch) => {
    const response = await fetch('/api/servers')

    const servers = await response.json();
    if (servers.errors) {
        return;
    }
    dispatch(getServersAction(servers))
}

export const createServer = (name) => async (dispatch) => {
    const response = await fetch('/api/servers', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({name})
    })

    const server = await response.json();
    if (server.errors) {
        return;
    }
    dispatch(createServerAction(server))
}

const flatServers = (servers) => {
    const fServer = {}
    for (server in servers) {
        fServer[server.id] = server
    }
    return fServer
}

const initialState = {servers:{}}

export default function reducer(state=initialState, action) {
    switch(action.type) {
        case GET_ALL_SERVERS:
            return {servers: flatServers(action.payload)}
        case CREATE_SERVER:
            const newState = {servers: ...state.servers}
            newState.servers[action.payload.id] = action.payload
            return newState
        default:
            return state;
    }
}