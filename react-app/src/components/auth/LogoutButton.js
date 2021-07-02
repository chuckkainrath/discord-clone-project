import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { logout } from "../../store/session";
import { useHistory } from 'react-router-dom'
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import styles from './LogoutButton.module.css';

const LogoutButton = () => {
  const dispatch = useDispatch();
  const history = useHistory()
  const [logoutTog, setLogoutTog] = useState(false);
  useEffect(() => {
    if (logoutTog) {
      history.push('/')
    }
    setLogoutTog(false)
  }, [logoutTog, history])
  const onLogout = async (e) => {
    setLogoutTog(true)
    await dispatch(logout());
  };

  const logoutTooltip = props => <Tooltip id='logout-tooltip' {...props}>Logout</Tooltip>

  return (
    <OverlayTrigger
      placement='top'
      delay={{ show: 250, hide: 250 }}
      overlay={logoutTooltip}
    >
      <button
        title='Logout'
        onClick={onLogout}
        className={styles.logout_button}
      >
        <i class="fas fa-sign-out"></i>
      </button>
    </OverlayTrigger>
  )
};

export default LogoutButton;
