import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './LandingPage.css'
import Bryan from './FooterRef/bryan.jpg'
import Chuck from './FooterRef/chuck.jpg'
import Malik from './FooterRef/malik.jpg'
import Tyler from './FooterRef/thumbnail.jpg'
import linkedIn from './FooterRef/LI-In-Bug.png'
import github from './FooterRef/GitHub-Mark-64px.png'
import landingBackground from './auth/landing.jpg';

function LandingPage() {
  const [showBryan, setShowBryan] = useState(false)
  const [showChuck, setShowChuck] = useState(false)
  const [showMalik, setShowMalik] = useState(false)
  const [showTyler, setShowTyler] = useState(false)

  const toggleBryan = () => {
    if(!showBryan){
      setShowBryan(true)
    } else setShowBryan(false)
  }
  const toggleChuck = () => {
    if(!showChuck){
      setShowChuck(true)
    } else setShowChuck(false)
  }
  const toggleMalik = () => {
    if(!showMalik){
      setShowMalik(true)
    } else setShowMalik(false)
  }
  const toggleTyler = () => {
    if(!showTyler){
      setShowTyler(true)
    } else setShowTyler(false)
  }


  return (
    <div className="landing">
      <h1 className="landing-title">Racket</h1>
      <div className="landing-content"
           style={{ backgroundImage: `url(${landingBackground})` }}>
        <div className="text-container">
          <h1 className="landing-textheader">Your place to talk</h1>
          <div className="landing-textbody">
            <h3 className="landing-description">
              Whether you’re part of a school club, gaming group, worldwide art community,
              or just a handful of friends that want to spend time together, Racket makes
              it easy to talk every day and hang out more often.
                  </h3>
          </div>
          <div className="landing-links">

            <Link to="/login" className="login-button">Login</Link>
            <Link to="/sign-up" className="signup-button">Sign Up</Link>
          </div>
        </div>
      </div>
      <footer className='footer'>
        <p className='footer__text'>Dev Team</p>
        <div className='footer__container'>
          <div className='ind__container'>
            <img onClick={toggleBryan} className='footer__pic' src={Bryan} alt='Bryan'></img>
              {showBryan ?
                <div className='footer__links'>
                  <a href='https://www.linkedin.com/in/bryan-thomas-108b891b5/'><img className='linkedIn' src={linkedIn} alt='LinkedIn'></img></a>
                  <a href='https://github.com/Joemanf'><img className='github' src={github} alt='Github'></img></a>
                </div> : null}
          </div>
          <div className='ind__container'>
            <img onClick={toggleChuck} className='footer__pic' src={Chuck} alt='Chuck'></img>
              {showChuck ?
                <div className='footer__links'>
                  <a href='https://www.linkedin.com/in/chuck-kainrath-42820b20b/'><img className='linkedIn' src={linkedIn} alt='LinkedIn'></img></a>
                  <a href='https://github.com/chuckkainrath'><img className='github' src={github} alt='Github'></img></a>
                </div> : null}
          </div>
          <div className='ind__container'>
            <img onClick={toggleMalik} className='footer__pic' src={Malik} alt='Malik'></img>
              {showMalik ?
                  <div className='footer__links'>
                    <a href='https://www.linkedin.com/in/cedmoss/'><img className='linkedIn' src={linkedIn} alt='LinkedIn'></img></a>
                    <a href='https://github.com/malikmoss'><img className='github' src={github} alt='Github'></img></a>
                  </div> : null}
          </div>
          <div className='ind__container'>
            <img onClick={toggleTyler} className='footer__pic' src={Tyler} alt='Tyler'></img>
              {showTyler ?
                  <div className='footer__links'>
                    <a href='https://www.linkedin.com/in/tyler-ruby-b700161ba/'><img className='linkedIn' src={linkedIn} alt='LinkedIn'></img></a>
                    <a href='https://github.com/TylerRuby0821'><img className='github' src={github} alt='Github'></img></a>
                  </div> : null}
          </div>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage;
