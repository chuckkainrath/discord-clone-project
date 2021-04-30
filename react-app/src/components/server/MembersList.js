import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useServer } from '../../context/ServerContext'
import { getUsersForSidebar, removeMembers } from '../../store/members'
function MembersList() {
    const dispatch = useDispatch()
    const { serverId } = useServer()
    const members = useSelector(state => state.members.members)
    const [membersArr, setMembersArr] = useState([])
    useEffect(() => {
        let tempMembersArr = []
        for (let member in members) {
            tempMembersArr.push(members[member])
        }
        setMembersArr(tempMembersArr)
    }, [members])
    useEffect(() => {
        dispatch(removeMembers())
        dispatch(getUsersForSidebar(serverId))
        let tempMembersArr = []
        for (let member in members) {
            tempMembersArr.push(members[member])
        }
        setMembersArr(tempMembersArr);
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
