import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useServer } from '../../context/ServerContext'
import { getUsersForSidebar } from '../../store/members'

function MembersList() {
    const dispatch = useDispatch()

    const { serverId } = useServer()

    const members = useSelector(state => state.members)

    const membersArr = []

    for (let member in members) {
        membersArr.push(members[member])
    }

    console.log('PLEASE GOD, ', membersArr)

    useEffect(() => {
        dispatch(getUsersForSidebar(serverId))
    }, [serverId])

    return (
        <div>
            <p>Members:</p>
            <div>{membersArr.map(member => (
                member
            ))}</div>
        </div>
    )
}

export default MembersList