import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, Redirect } from 'react-router-dom';
import { signUp } from '../../store/session';
import './SignUpForm.css'

const SignUpForm = () => {
  const dispatch = useDispatch();
  const user = useSelector(state => state.session.user);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");

  const onSignUp = async (e) => {
    e.preventDefault();
    if (password === repeatPassword) {
      await dispatch(signUp(username, email, password));
    }
  };

  const updateUsername = (e) => {
    setUsername(e.target.value);
  };

  const updateEmail = (e) => {
    setEmail(e.target.value);
  };

  const updatePassword = (e) => {
    setPassword(e.target.value);
  };

  const updateRepeatPassword = (e) => {
    setRepeatPassword(e.target.value);
  };

  if (user) {
    return <Redirect to="/servers/0" />;
  }

  return (
    <div className='signup-container'>
      <div className="form-container">
        <form classname='signup-form' onSubmit={onSignUp}>
          <h1>Sign Up</h1>
          <div className='field-container'>
            <label className='form-label'>User Name</label>
            <input
              className='form-input'
              type="text"
              name="username"
              onChange={updateUsername}
              value={username}
            ></input>
          </div>
          <div className='field-container'>
            <label className='form-label'>Email</label>
            <input
              className='form-input'
              type="text"
              name="email"
              onChange={updateEmail}
              value={email}
            ></input>
          </div>
          <div className='field-container'>
            <label className='form-label'>Password</label>
            <input
              className='form-input'
              type="password"
              name="password"
              onChange={updatePassword}
              value={password}
            ></input>
          </div>
          <div className='field-container'>
            <label className='form-label'>Repeat Password</label>
            <input
              className='form-input'
              type="password"
              name="repeat_password"
              onChange={updateRepeatPassword}
              value={repeatPassword}
              required={true}
            ></input>
          </div>
          <div className='field-container'>
            <button className='signup-button' type="submit">Sign Up</button>
          </div>
          <div className='field-container nav-text'> Already have an account? <NavLink className='signup-button' to='/login'>Login Here</NavLink></div>
        </form>
      </div>
    </div>
  );
};

export default SignUpForm;
