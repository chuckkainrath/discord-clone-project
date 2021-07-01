import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getServers } from '../../store/server'
import { getInvites } from '../../store/invites'
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import LogoutButton from '../auth/LogoutButton'
import InviteItem from './InviteItem';
import styles from './ProfileBar.module.css'
import { useParams } from 'react-router-dom'

function ProfileBar() {
  const dispatch = useDispatch()
  const { serverId } = useParams();
  // useParams
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
  }, [showInvites])

  const noInvitesTooltip = props => (
    <Tooltip id="no-invites-tooltip" {...props}>No pending invites</Tooltip>
  );

  const invitesTooltip = props => <Tooltip id='invites-tooltip' {...props}>You have pending invites!</Tooltip>

  return (
    <div className={styles.profile_bar_container}>
      <div className="user-displayname">
        {user && user.username}
      </div>
      {invites.length > 0 &&
        <div onClick={() => toggleShowInvites(!showInvites)}>
          <OverlayTrigger
            placement='top'
            delay={{ show: 250, hide: 250 }}
            overlay={invitesTooltip}
          >
            <span className={styles.invites}>
              <i className="fas fa-bell"></i>
            </span>
          </OverlayTrigger>
        </div>
      }
      {invites.length === 0 &&
        <div>
          <OverlayTrigger
            placement='top'
            delay={{ show: 250, hide: 250 }}
            overlay={noInvitesTooltip}
          >
            <span className={styles.no_invites}>
              <i className="fas fa-bell"></i>
            </span>
          </OverlayTrigger>
        </div>
      }
      {showInvites &&
        <div className={styles.show_invites_container__invis}>
          <div className={parseInt(serverId) === 0 ? styles.show_invites_container_down : styles.show_invites_container}>
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
