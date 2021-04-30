import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getServers } from '../../store/server'
import LogoutButton from '../auth/LogoutButton'

function ProfileBar() {
  const dispatch = useDispatch()
  const user = useSelector(state => state.session.user)

  useEffect(() => {
    dispatch(getServers())
  }, [])

  return (
    <div>
      <div className="user-displayname">
        {user && user.username}
      </div>
      <LogoutButton />
    </div>
  )
}

export default ProfileBar