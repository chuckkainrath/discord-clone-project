import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, Redirect } from 'react-router-dom';
import { signUp } from '../../store/session';
import AvatarInput from './AvatarInput';
import backgroundImg from './login-background.jpg';
import './SignUpForm.css'

const SignUpForm = () => {
  const dispatch = useDispatch();
  const user = useSelector(state => state.session.user);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [picture, setPicture] = useState(null);
  const [choosingPicture, setChoosingPicture] = useState(false);

  const onSignUp = async (e) => {
    e.preventDefault();
    if (password === repeatPassword) {
      await dispatch(signUp(username, email, password, picture));
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

  const selectPhoto = e => {
    e.preventDefault();
    setChoosingPicture(true);
  }

  if (user) {
    return <Redirect to="/servers/0" />;
  }

  return (
    <div className='signup-container'
         style={{ backgroundImage: `url(${backgroundImg})`}}
    >
      <div className="form-container">
        <form className='signup-form' onSubmit={onSignUp}>
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
          {!picture &&
            <div className={'form-label'}>
              <label>Profile Picture (Optional)</label>
              <button
                className={'photo-button'}
                onClick={selectPhoto}>Choose a Photo</button>
            </div>
          }
          {picture &&
            <div className={'photo form-label'}>
              <div>Profile Picture (Optional)</div>
              <div className='photo-cont'>
                <img
                  className={'profile-image'}
                  src={URL.createObjectURL(picture)}
                />
                <button className='signup-button' onClick={() => setPicture()}>Delete Photo</button>
              </div>
            </div>
          }
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
      <AvatarInput
        picTitle='Profile Picture (Optional)'
        setPicture={setPicture}
        setChoosingPicture={setChoosingPicture}
        choosingPicture={choosingPicture} />
    </div>
  );
};

export default SignUpForm;
