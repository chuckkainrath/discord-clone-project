import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { logout } from "../../store/session";
import { useHistory } from 'react-router-dom'

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

  return <button onClick={onLogout}>Logout</button>;
};

export default LogoutButton;
