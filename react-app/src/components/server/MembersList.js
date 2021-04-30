import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useServer } from '../../context/ServerContext'
import { getUsersForSidebar, removeMembers } from '../../store/members'
function MembersList() {
    const dispatch = useDispatch()
    const { serverId } = useServer()
    const members = useSelector(state => state.members.members)
    let membersArr = []
    for (let member in members) {
        membersArr.push(members[member])
    }
    useEffect(() => {
        dispatch(removeMembers())
        dispatch(getUsersForSidebar(serverId))
        membersArr = []
        for (let member in members) {
            membersArr.push(members[member])
        }
    }, [serverId])
    return (
        <div>
            <p>Members:</p>
            <div>{membersArr.map(member => (
                <div key={member.id}>
                    {member.name}
                </div>
            ))}</div>
        </div>
    )
}
export default MembersList
