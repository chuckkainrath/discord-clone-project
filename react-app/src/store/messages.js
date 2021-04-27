const GET_ALL_MESSAGES = "message/GET_ALL_MESSAGES"
const CREATE_MESSAGE = "message/CREATE_MESSAGE"
const EDIT_MESSAGE = "message/EDIT_MESSAGE"
const DELETE_MESSAGE = "message/DELETE_MESSAGE"

const getMessagesAction = (messages) => ({
    type: GET_ALL_MESSAGES,
    payload: messages
})

const createMessageAction = (message) => ({
    type: CREATE_MESSAGE,
    payload: message
})

const editMessageAction = (message) => ({
    type: EDIT_MESSAGE,
    payload: message
})

const deleteMessageAction = (message) => ({
    type: DELETE_MESSAGE,
    payload: message
})

export const getMessages = (serverId, channelId) => async (dispatch) => {
    const response = await fetch(`/api/servers/${serverId}/channels/${channelId}`)

    const messages = await response.json();
    if (messages.errors) {
        return;
    }
    dispatch(getMessagesAction(messages))
}

export const createMessage = (body, serverId, channelId) => async (dispatch) => {
    const response = await fetch(`/api/servers/${serverId}/channels/${channelId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ body })
    })

    const message = await response.json();   // message.message or w/e the key is
    if (message.errors) {
        return;
    }
    dispatch(createMessageAction(message))
}

export const editMessage = (body, serverId, channelId, messageId) => async (dispatch) => {
    const response = await fetch(`/api/servers/${serverId}/channels/${channelId}/${messageId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ body })
    })

    const message = await response.json();
    if (message.errors) {
        return;
    }
    dispatch(editMessageAction(message))
}


export const deleteMessage = (channelId, serverId, messageId) => async (dispatch) => {
    const response = await fetch(`/api/servers/${serverId}/channels/${channelId}/${messageId}`, {
        method: 'DELETE'
    });

    const data = await response.json();
    if (data.errors) {
        return;
    }
    dispatch(deleteMessageAction(messageId))
}

const flatMessages = (messages) => {
    const fMessage = {}
    messages.forEach(message => {
        fMessage[message.id] = message;
    });
    return fMessage;
}

const initialState = { messages: {} }

export default function reducer(state = initialState, action) {
    let newState
    switch (action.type) {
        case GET_ALL_MESSAGES:
            return { messages: flatMessages(action.payload) }
        case CREATE_MESSAGE:
            newState = { messages: { ...state.messages } }
            newState.messages[action.payload.id] = action.payload
            return newState
        case EDIT_MESSAGE:
            newState = { messages: { ...state.messages } }
            newState.messages[action.payload.id] = action.payload
            return newState
        case DELETE_MESSAGE:
            newState = { messages: { ...state.messages } }
            delete newState.messages[action.payload]
            return newState
        default:
            return state;
    }
}
