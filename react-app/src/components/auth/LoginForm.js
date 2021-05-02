import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Redirect, NavLink } from "react-router-dom";
import { login } from "../../store/session";
import { getServers } from '../../store/server'
import background from './login-background.jpg'
import './LoginForm.css'

const LoginForm = () => {
  const dispatch = useDispatch();
  const user = useSelector(state => state.session.user);
  const servers = useSelector(state => state.servers.servers);
  const [errors, setErrors] = useState([]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onLogin = async (e) => {
    e.preventDefault();
    const data = await dispatch(login(email, password));
    if (data.errors) {
      setErrors(data.errors);
    }
    let servs = await dispatch(getServers());
    if (servs && servs.length > 0) {
      return <Redirect to={`/servers/${servs[0].id}`} />
    }
    return <Redirect to="/servers/0" />;
  };

  const DemoLogin = async (e) => {
    e.preventDefault();
    const data = await dispatch(login('demo@aa.io', 'password'));
    if (data.errors) {
      setErrors(data.errors);
    }
    let servs = await dispatch(getServers());
    if (servs && servs.length > 0) {
      return <Redirect to={`/servers/${servs[0].id}`} />
    }
    return <Redirect to="/servers/0" />;
  };

  const updateEmail = (e) => {
    setEmail(e.target.value);
  };

  const updatePassword = (e) => {
    setPassword(e.target.value);
  };

  if (user) {
    let serverData = Object.keys(servers);
    if (serverData.length > 0) {
      return <Redirect to={`/servers/${serverData[0]}`} />
    }
    return <Redirect to="/servers/0" />;
  }

  return (
    <div className="login-container">
      <img className="background-image" src={background} />
      <div className="form-container">
        <form className="login-form" onSubmit={onLogin}>
          <div className="errors">
            {errors.map((error) => (
              <div>{error}</div>
            ))}
          </div>
          <div className="field-container">
            <label className="form-label" htmlFor="email">Email</label>
            <input className="form-input"
              name="email"
              type="text"
              value={email}
              onChange={updateEmail}
            />
          </div>
          <div className="field-container">
            <label className="form-label" htmlFor="password">Password</label>
            <input className="form-input"
              name="password"
              type="password"
              value={password}
              onChange={updatePassword}
            />
            <button className="li-button" type="submit">Login</button>
            <button className="demo-button" type="submit" onClick={DemoLogin}>Demo User</button>
          </div>
          <div className='field-container nav-text'> Need an account? <NavLink className='signup-button' to='/sign-up'>Sign Up Here</NavLink></div>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
