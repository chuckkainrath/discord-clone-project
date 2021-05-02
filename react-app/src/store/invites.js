const REMOVE_INVITE = 'invites/REMOVE'
const GET_INVITES = 'invites/GET'

export const removeInviteAction = server_id => ({
    type: REMOVE_INVITE,
    payload: server_id
})

const getInvitesAction = invites => ({
    type: GET_INVITES,
    payload: invites
})

export const getInvites = () => async dispatch => {
    const response = await fetch(`/api/invites/`);
    const data = await response.json();
    dispatch(getInvitesAction(data.invites))
}

export const processInvite = (server_id, accept) => async dispatch => {
    const response = await fetch(`/api/invites/${server_id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ accept })
    });
    const data = await response.json();
    if (data.response) {
        return;
    }
    dispatch(removeInviteAction(server_id));
    return data.server;
}

export const sendInvite = async (serverId, username) => {
    const response = await fetch(`/api/invites/${serverId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username })
    });
    const data = await response.json();
    return data.response;
}

const flatInvites = (invites) => {
    const fInvites = {}
    invites.forEach(invite => {
        fInvites[invite.server_id] = invite
    })
    return fInvites
}

const initialState = { invites: {} }

export default function reducer(state = initialState, action) {
    let newState
    switch (action.type) {
        case GET_INVITES:
            return { invites: flatInvites(action.payload) }
        case REMOVE_INVITE:
            newState = { invites: { ...state.invites } };
            delete newState.invites[action.payload];
            return newState;
        default:
            return state;
    }
}
