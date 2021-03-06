import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Redirect, useHistory } from "react-router-dom";
import { login } from "../../store/session";
import { getServers } from '../../store/server'
import backgroundImg from './login-background.jpg';
import './LoginForm.css'

const LoginForm = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const user = useSelector(state => state.session.user);
  const servers = useSelector(state => state.servers.servers);
  // const [errors, setErrors] = useState([]);
  const [emailErr, setEmailErr] = useState('');
  const [passwordErr, setPasswordErr] = useState('');
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onLogin = async (e) => {
    e.preventDefault();
    const data = await dispatch(login(email, password));
    if (data.errors) {
      data.errors.forEach(err => {
        let errArr = err.split(':');
        if (errArr[0].trim() === 'email') {
          setEmailErr(errArr[1].trim());
        }
        if (errArr[0].trim() === 'password') {
          setPasswordErr(errArr[1].trim());
        }
      })
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
      data.errors.forEach(err => {
        let errArr = err.split(':');
        if (errArr[0].trim() === 'email') {
          setEmailErr(errArr[1].trim());
        }
        if (errArr[0].trim() === 'password') {
          setPasswordErr(errArr[1].trim());
        }
      })
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
    <div className="login-container"
         style={{ backgroundImage: `url(${backgroundImg})`}}
    >
      {/* <img className="background-image" src={background} /> */}
      <div className="form-container">
        <form className="login-form" onSubmit={onLogin}>
          {/* <div className="errors">
            {errors.map((error) => (
              <div>{error}</div>
            ))}
          </div> */}
          <div className="field-container">
            <label className="form-label" htmlFor="email">Email</label>
            <input className="form-input"
              name="email"
              type="text"
              value={email}
              onChange={updateEmail}
            />
            {emailErr && <p className='error'>{emailErr}</p>}
          </div>
          <div className="field-container">
            <label className="form-label" htmlFor="password">Password</label>
            <input className="form-input"
              name="password"
              type="password"
              value={password}
              onChange={updatePassword}
            />
            {passwordErr && <p className='error'>{passwordErr}</p>}
            <button className="li-button" type="submit">Login</button>
          </div>
          <div className='other-options'>
            <div>Don't have an account?
              <a tabIndex='0' className='redirect' onClick={() => history.push('/sign-up')}> Sign Up </a>
            </div>
            <div>Or login as a <a tabIndex='0' className='redirect' onClick={DemoLogin}>DemoUser</a></div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
