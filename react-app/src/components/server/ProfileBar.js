import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getServers } from '../../store/server'
import { getInvites } from '../../store/invites'
import LogoutButton from '../auth/LogoutButton'
import InviteItem from './InviteItem';

function ProfileBar() {
  const dispatch = useDispatch()
  const user = useSelector(state => state.session.user)
  const invitesObj = useSelector(state => state.invites.invites)
  const [invites, setInvites] = useState(Object.values(invitesObj))
  const [showInvites, toggleShowInvites] = useState(false);


  useEffect(() => {
    setInvites(Object.values(invitesObj))
  }, [invitesObj])

  useEffect(() => {
    dispatch(getServers())
    dispatch(getInvites())
  }, [])

  useEffect(() => {
    console.log('SHOWING INVITES', showInvites);
    console.log('INVITES????', invites);
  }, [showInvites])

  return (
    <div>
      <div className="user-displayname">
        {user && user.username}
      </div>
      <div onClick={() => toggleShowInvites(!showInvites)}>
        <i class="fas fa-bell"></i>
      </div>
      {showInvites &&
        <div>
          {invites &&
            <ul>
              {invites.map(invite => {
                // return <li key={invite.id}>Join {invite.server_name}</li>
                return <InviteItem key={invite.id} invite={invite} />
              })}
            </ul>
          }
          {invites.length === 0 && <div>No Invites</div>}
        </div>
      }
      <LogoutButton />
    </div>
  )
}

export default ProfileBar
