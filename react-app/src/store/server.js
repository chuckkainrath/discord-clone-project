const GET_ALL_SERVERS = "server/GET_ALL_SERVERS"
// const GET_SERVER = "server/GET_SERVER"
const CREATE_SERVER = "server/CREATE_SERVER"
const DELETE_SERVER = "server/DELETE_SERVER"

const getServersAction = (servers) => ({
    type: GET_ALL_SERVERS,
    payload: servers
})

const createServerAction = (server) => ({
    type: CREATE_SERVER,
    payload: server
})

const deleteServerAction = (server) => ({
    type: DELETE_SERVER,
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
        body: JSON.stringify({ name })
    })

    const server = await response.json();
    if (server.errors) {
        return;
    }
    dispatch(createServerAction(server))
}


export const deleteServer = (serverId) => async (dispatch) => {
    const response = await fetch(`api/server/${serverId}`, {
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
    for (let server in servers) {
        fServer[server.id] = server
    }
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
        default:
            return state;
    }
}