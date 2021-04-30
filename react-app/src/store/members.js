const GET_ALL_MEMBERS = "message/GET_ALL_MEMBERS"

const getMembersAction = (members) => ({
    type: GET_ALL_MEMBERS,
    payload: members
})

export const getUsersForSidebar = (serverId) => async (dispatch) => {
    const response = await fetch(`/api/servers/${serverId}/channels/members`)
    const members = await response.json();
    console.log("!!!!!MEMBERS IN THUNK!!!!!",members)
    if (members.errors) {
        return;
    }

    const membersArr = []

    for (const key in members.members) {
        membersArr.push(members.members[key])
    }
    console.log('MEMBERS ARR!!!!!', membersArr )
    dispatch(getMembersAction(membersArr))

    // for (let key in members.members) {
    //     dispatch(getMembersAction(members.members[key]))
    // }
}

// const flatMembers = (members) => {
//     const fChannel = {}
//     members.forEach(channel => {
//         fChannel[channel.id] = channel
//     })
//     return fChannel
// }

const initialState = {members: {}}

export default function reducer(state = initialState, action) {
    let newState
    switch (action.type) {
        case GET_ALL_MEMBERS: // MIGHT BE COMPLETELY MESSED UP
            newState = {members: {...state.members}}
            console.log("!!!NEW STATE ADDED PAYLOAD!!!", newState, action.payload)
            action.payload.forEach(member => {
                newState.members[member.id] = member
            })
            console.log("!!!NEWSTATE!!!", newState)
            // newState[action.payload.id] = action.payload.name
            return newState
        default:
            return state;
    }
}
