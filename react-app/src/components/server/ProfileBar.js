import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getServers } from '../../store/server'
import { getInvites } from '../../store/invites'
import LogoutButton from '../auth/LogoutButton'
import InviteItem from './InviteItem';
import styles from './ProfileBar.module.css'

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
  }, [dispatch])

  useEffect(() => {
  }, [showInvites])

  return (
    <div className={styles.profile_bar_container}>
      <div className="user-displayname">
        {user && user.username}
      </div>
      {invites.length > 0 &&
        <div onClick={() => toggleShowInvites(!showInvites)}>
            <span className={styles.invites}>
              <i className="fas fa-bell"></i>
            </span>
        </div>
      }
      {invites.length === 0 &&
        <div>
          <span>
            <i className="fas fa-bell"></i>
          </span>
        </div>
      }
      {showInvites &&
        <div className={styles.show_invites_container__invis}>
          <div className={styles.show_invites_container}>
            {invites &&
              <ul>
                {invites.map(invite => {
                  return <InviteItem key={invite.id} invite={invite} toggleShowInvites={toggleShowInvites} />
                })}
              </ul>
            }
            {invites.length === 0 && <div>No Invites</div>}
          </div>
        </div>
      }
      <LogoutButton />
    </div>
  )
}

export default ProfileBar
