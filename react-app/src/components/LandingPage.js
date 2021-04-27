import React from 'react';
import {Link} from 'react-router-dom';
import './LandingPage.css'

function LandingPage () {
    return (
        <div className="landing">
          <div className="landing-home">
            <div className="landing-content">
              <header>
                <img className="discord-logo" src="" alt=""/>
                {/* <div className="signup-button"> */}
                    {/* <Link className="linksize-small" to="/sign-up">Sign Up</Link> */}

                {/* </div> */}
              </header>
              <div>
                <h1 className="landing-textheader">Your place to talk</h1>
                <div className="landing-textbody">
                  <h3 className="landing-description">
                    Whether you’re part of a school club, gaming group, worldwide art community,
                    or just a handful of friends that want to spend time together, Racket makes
                    it easy to talk every day and hang out more often.
                  </h3>
                </div>
                <div className="landing-links">

                  <Link to ="/login" className="login-button">Login</Link>
                  <Link to ="/sign-up" className="signup-button">Sign Up</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
    )
}

export default LandingPage;