import React, { useState } from "react";
import  { useDispatch, useSelector } from "react-redux";
import { Redirect, NavLink } from "react-router-dom";
import { login } from "../../store/session";
import { getServers } from '../../store/server';
import background from './login-background.jpg'
import './LoginForm.css'

const LoginForm = () => {
  const dispatch = useDispatch();
  const user = useSelector(state => state.session.user);
  const [errors, setErrors] = useState([]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onLogin = async (e) => {
    e.preventDefault();
    const data = await dispatch(login(email, password));
    if (data.errors) {
      setErrors(data.errors);
    }
    await dispatch(getServers());
  };

  const DemoLogin = async (e) => {
    e.preventDefault();
    const data = await dispatch(login('demo@aa.io', 'password'));
    if (data.errors) {
      setErrors(data.errors);
    }
    await dispatch(getServers());
  };

  const updateEmail = (e) => {
    setEmail(e.target.value);
  };

  const updatePassword = (e) => {
    setPassword(e.target.value);
  };

  if (user) {
    return <Redirect to="/servers" />;
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
          <div className='field-container'>
            <label className='form-label' htmlFor="email">Email</label>
            <input className='form-input'
              name="email"
              type="text"
              // placeholder="Email"
              value={email}
              onChange={updateEmail}
            />
          </div>
          <div className='field-container'>
            <label className='form-label' htmlFor="password">Password</label>
            <input className='form-input'
              name="password"
              type="password"
              // placeholder="Password"
              value={password}
              onChange={updatePassword}
            />
            <button  className="li-button" type="submit">Login</button>
            <button className="demo-button" type="submit" onClick={DemoLogin}>Demo User</button>
          </div>
          <div className='field-container nav-text'> Dont have an account? <NavLink className ='li-button' to='/sign-up'>Sign Up Here</NavLink></div>
        </form>
     </div>
   </div>
  );
};

export default LoginForm;
