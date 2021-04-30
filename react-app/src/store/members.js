const GET_ALL_MEMBERS = "message/GET_ALL_MEMBERS"
const REMOVE_MEMBERS = "message/REMOVE_MEMBERS"
const REMOVE_MEMBER = "message/REMOVE_MEMBER"

const getMembersAction = (members) => ({
    type: GET_ALL_MEMBERS,
    payload: members
})

export const removeMemberAction = (memberId) => ({
    type: REMOVE_MEMBER,
    memberId
})

export const removeMembers = () => ({
    type: REMOVE_MEMBERS
})

export const getUsersForSidebar = (serverId) => async (dispatch) => {
    const response = await fetch(`/api/servers/${serverId}/channels/members`)
    const members = await response.json();
    if (members.errors) {
        return;
    }

    const membersArr = []

    for (const key in members.members) {
        membersArr.push(members.members[key])
    }
    dispatch(getMembersAction(membersArr))
}

const initialState = { members: {} }

export default function reducer(state = initialState, action) {
    let newState
    switch (action.type) {
        case GET_ALL_MEMBERS: // MIGHT BE COMPLETELY MESSED UP
            newState = { members: { ...state.members } }
            action.payload.forEach(member => {
                newState.members[member.id] = member
            })
            return newState
        case REMOVE_MEMBERS:
            newState = { members: {} }
            return newState
        case REMOVE_MEMBER:
            newState = { members: { ...state.members } }
            delete newState.members[action.memberId]
            return newState
        default:
            return state;
    }
}
