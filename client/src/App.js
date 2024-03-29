import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";
import './App.css';
import SettingsGeneral from './components/SettingsGeneral.js';
import SettingsAppearance from './components/SettingsAppearance.js';
import SettingsSignout from './components/SettingsSignout.js';
import ChatWindow from './components/ChatWindow.js';
import LoginPage from './components/LoginPage.js';
import About from './components/About.js';
import SignupPage from './components/SignupPage.js';
import SearchPage from './components/SearchPage.js';
import FriendRequests from './components/FriendRequests.js';
import Nav from './components/Nav.js';
import Page404 from './components/Page404.js';

//changed App from a function a class 
class App extends Component {

  // set up routing for every page within the app
  render() {
    return (
      <div className="App">
        <Router>
          <div>
            <Nav />
            <div id="alert-green" />
            <div id="alert-red" />
            <Switch>
              <Route path="/about">
                <About />
              </Route>
              <Route path="/signup">
                <SignupPage />
              </Route>
              <Route path="/login">
                <LoginPage />
              </Route>
              <Route path="/chatapp">
                <LoginPage />
              </Route>
              <Route path="/chats">
                <ChatWindow />
              </Route>
              <Route path="/search">
                <SearchPage />
              </Route>
              <Route path="/settings/general">
                <SettingsGeneral />
              </Route>
              <Route path="/settings/appearance">
                <SettingsAppearance />
              </Route>
              <Route path="/settings/signout">
                <SettingsSignout />
              </Route>
              <Route path="/search">
                <SearchPage />
              </Route>
              <Route path="/friendrequests">
                <FriendRequests />
              </Route>
              <Route exact path="/"> {/* needs to be exact path otherwise it becomes default */}
                <LoginPage />
              </Route>
              <Route path="/404" component={Page404} />
              <Redirect to="/404" />
            </Switch>
          </div>
        </Router>
      </div>
    )
  }
}

export default App;
