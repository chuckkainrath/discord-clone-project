import React, { useState } from "react";
import  { useDispatch, useSelector } from "react-redux";
import { Redirect } from "react-router-dom";
import { login } from "../../store/session";
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
  };

  const DemoLogin = async (e) => {
    e.preventDefault();
    const data = await dispatch(login('demo@aa.io', 'password'));
    if (data.errors) {
      setErrors(data.errors);
    }
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
          <div className="email-container">
            <label className="email-label" htmlFor="email">Email</label>
            <input className="email-input"
              name="email"
              type="text"
              // placeholder="Email"
              value={email}
              onChange={updateEmail}
            />
          </div>
          <div className="pw-container">
            <label className="pw-label" htmlFor="password">Password</label>
            <input className="pw-input"
              name="password"
              type="password"
              // placeholder="Password"
              value={password}
              onChange={updatePassword}
            />
            <button  className="li-button" type="submit">Login</button>
            <button className="demo-button" type="submit" onClick={DemoLogin}>Demo User</button>
          </div>
        </form>
     </div>
   </div>
  );
};

export default LoginForm;
