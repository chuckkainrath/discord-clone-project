import React from 'react'
import { useSelector } from 'react-redux'

function ProfileBar() {
    const user = useSelector(state => state.session.user)

    return (
        <div className="user-displayname">
          {user && user.username}
        </div>
    )
}

export default ProfileBar