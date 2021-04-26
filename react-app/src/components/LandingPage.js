import React from 'react';
import {Link} from 'react-router-dom';

const LandingPage = props => {
    return (
        <div className="landing">
          <div className="landing-home">
            <div className="landing-content">
              <header>
                <img className="discord-logo" src={window.discordLogo} alt=""/>
              </header>
              <div className="landing-textbody">
                <h1>Your place to talk</h1>
                <h3>
                    Whether you’re part of a school club, gaming group, worldwide art community,
                    or just a handful of friends that want to spend time together, Discord makes
                    it easy to talk every day and hang out more often.
                </h3>
                <div className="landing-links">

                  <Link to ="/login" className="linksize-big">Login</Link>
                  <a className="linksize-big">Try Demo</a>
                </div>
              </div>
            </div>
          </div>
        </div>
    )
}

export default LandingPage;