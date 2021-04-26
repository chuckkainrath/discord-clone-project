const GET_ALL_SERVERS = "server/GET_ALL_SERVERS"
const GET_SERVER = "server/GET_SERVER"
const CREATE_SERVER = "server/CREATE_SERVER"

const getServerAction = (servers) => ({
    type: GET_ALL_SERVERS,
    payload: servers
})

const createServerAction = (server) => ({
    type: CREATE_SERVER,
    payload: server
})

export const getServers = () => async (dispatch) => {
    const response = await fetch
}

export const createServer = () => async (dispatch) => {
    
}


const initialState = null

export default function reducer(state=initialState, action) {
    switch(action.type) {
        case GET_ALL_SERVERS:

        case CREATE_SERVER:

        default:
            return state;
    }
}