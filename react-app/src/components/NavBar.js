import React from 'react';
import { NavLink } from 'react-router-dom';
import LogoutButton from './auth/LogoutButton';

const NavBar = () => {
  return (
    <nav>
      <ul>
        <li>
          <NavLink to="/" exact={true} activeClassName="active">
            Home
          </NavLink>
        </li>
        <li>
          <NavLink to="/login" exact={true} activeClassName="active">
            Login
          </NavLink>
        </li>
        <li>
          <NavLink to="/sign-up" exact={true} activeClassName="active">
            Sign Up
          </NavLink>
        </li>
        <li>
          <NavLink to="/servers" exact={true} activeClassName="active">
            Servers
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}

export default NavBar;
