const GET_ALL_MEMBERS = "message/GET_ALL_MEMBERS"

const getMembersAction = (members) => ({
    type: GET_ALL_MEMBERS,
    payload: members
})

export const getUsersForSidebar = (serverId) => async (dispatch) => {
    console.log("HOOOHAAAAAAAAAAAAAAAAAA")
    const response = await fetch(`/api/servers/${serverId}/channels/members`)

    const members = await response.json();
    console.log('EHEHEHEHEHHEHEHEHE', members)
    if (members.errors) {
        return;
    }
    for (let key in members.members) {
        dispatch(getMembersAction(members.members[key]))
    }

}

// const flatMembers = (members) => {
//     const fChannel = {}
//     members.forEach(channel => {
//         fChannel[channel.id] = channel
//     })
//     return fChannel
// }

const initialState = {}

export default function reducer(state = initialState, action) {
    let newState
    switch (action.type) {
        case GET_ALL_MEMBERS: // MIGHT BE COMPLETELY MESSED UP
            newState = { ...state.members }
            newState[action.payload.id] = action.payload.name
            return newState
        default:
            return state;
    }
}
