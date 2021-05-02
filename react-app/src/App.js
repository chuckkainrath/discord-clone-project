import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import LoginForm from "./components/auth/LoginForm";
import SignUpForm from "./components/auth/SignUpForm";
import LandingPage from "./components/LandingPage"
import Server from "./components/server/Server"
import ServerBar from "./components/server/ServerBar"
import { authenticate } from "./store/session";
import { getServers } from "./store/server";

function App() {
  const dispatch = useDispatch()
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      const authenticated = await dispatch(authenticate());
      if (authenticated) {
        await dispatch(getServers());
      }
      setLoaded(true);
    })();
  }, [dispatch]);

  if (!loaded) {
    return null;
  }

  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" exact={true}>
          <LandingPage />
        </Route>
        <Route path="/login" exact={true}>
          <LoginForm />
        </Route>
        <Route path="/sign-up" exact={true}>
          <SignUpForm />
        </Route>
        <Route path="/servers/:serverId" exact={true}>
          <div className='server_top_grid'>
            <ServerBar loaded={loaded} />
            <Server />
          </div>
        </Route>
      </Switch>
    </BrowserRouter>
  );
}

export default App;
