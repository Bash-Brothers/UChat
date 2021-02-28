import React, { Component } from "react";
import './App.css';
import Settings from './components/Settings.js';
import ChatWindow from './components/ChatWindow.js';
import LoginPage from './components/LoginPage.js';
import About from './components/About.js';
import SignupPage from './components/SignupPage.js';
import ContactUsPage from './components/ContactUsPage.js';
import SearchPage from './components/SearchPage.js';
import IconLogin from './images/icon_login.svg';
import IconSettings from './images/icon_settings.svg';
import IconInfo from './images/icon_info.svg';
import IconRegister from './images/icon_register.svg';
import IconChat from './images/icon_chat.svg';
import IconContactUs from './images/icon_contactus.svg';
import IconSearch from './images/icon_search.svg';
import IconNotif from './images/icon_notif.svg';



// looks at the current page (from App's state) and renders the relevant page
function CurPage(props) {
  const page = props.page;
  switch (page) {
    case 0:
      return <LoginPage />;
    case 1:
      return <SignupPage />;
    case 2:
      return <About />;
    case 3:
      return <Settings />;
    case 4:
      return <ChatWindow />;
    case 5:
      return <SearchPage />;
    case 6:
      return <ContactUsPage />;
      
  }
  return <LoginPage />;
}

// render the notifications menu if the user has clicked on the notifications button
function RenderNotifs(props) {
  const status = props.status;
  if (status) {
    return (
      <div class="notifications">
        <div class="notifications-content">
          notification
        </div>
        <div class="notifications-content">
          notification
        </div>
        <div class="notifications-content">
          notification
        </div>
        <div class="notifications-content">
          notification
        </div>
        <div class="notifications-content">
          notification
        </div>
        <div class="notifications-content">
          notification
        </div>
        <div class="notifications-content">
          notification
        </div>
        <div class="notifications-content">
          notification
        </div>
      </div>
      )
  }
  return (null);
}


//changed App from a function a class 
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      curPage: 0,
      loggedIn: true,
      showNotif: false,
    };
    /*this.CurNav = this.CurNav.bind(this);
    this.mainNav = this.mainNav.bind(this);
    this.LogInNav = this.CurNav.bind(this);*/
  }
  //curPage values: Log in page: 0, Sign up page: 1, About page: 2, Settings page: 3, Chats page: 4
  //loggedIn state variable is to make sure someone is logged in before they can click on settings or chats

  handleClick(i) {
    this.setState({
      curPage: i,
    })
  }

  handleLogin() {
    this.setState({
      curPage: 2,
    })
  }

  handleNotifClick() {
    this.setState({
      showNotif: !this.state.showNotif,
    })
  }
  /*LogInNav() {
    return (
      <div className="navigation">
        <div className="navButton" onClick={() => this.handleClick(3)}>
          Settings
        </div>
        <div className="navButton" onClick={() => this.handleClick(4)}>
          Chats
        </div>
        <div className="navButton" onClick={() => this.handleClick(0)}>
          Log Out
        </div>
      </div>
    )
  }
  
  mainNav() {
    return (
      <div className="navigation">
        <div className="navButton" onClick={() => this.handleClick(0)}>
          Log In
        </div>
        <div className="navButton" onClick={() => this.handleClick(2)}>
          About
        </div>
        <div className="navButton" onClick={() => this.handleClick(1)}>
          Sign Up
        </div>
        <div className="navButton" onClick={() => this.handleClick(5)}>
          Temp Log In
        </div>
      </div>
    )
  }

  CurNav() {
    switch (this.state.curPage) {
      case 0:
      case 1:
      case 2:
        return <this.mainNav />
      case 3:
      case 4:
      case 5:
        return <this.LogInNav />
    }
    return <this.mainNav />
  }
  */

  render() {
    return (
      <div className="App">
        <div className="navigation">

        <div className="navButton" onClick={() => this.handleClick(0)}>
          <img src={IconLogin} id="loginicon" width="30" height="30"/>
        </div>
        <div className="navButton" onClick={() => this.handleClick(1)}>
          <img src={IconRegister} id="registericon" width="30" height="30"/>
        </div>
        <div className="navButton" onClick={() => this.handleClick(2)}>
          <img src={IconInfo} id="infoicon" width="30" height="30"/>
        </div>
        <div className="navButton" onClick={() => this.handleClick(3)}>
          <img src={IconSettings} id="settignsicon" width="30" height="30"/>
        </div>
        <div className="navButton" onClick={() => this.handleClick(4)}>
          <img src={IconChat} id="chaticon" width="30" height="30"/>
        </div>
        <div className="navButton" onClick={() => this.handleClick(5)}>
          <img src={IconSearch} id="chaticon" width="30" height="30"/>
        </div>
        <div className="navButton" onClick={() => this.handleClick(6)}>
          <img src={IconContactUs} id="chaticon" width="30" height="30"/>
        </div>
          <div className="navButton" onClick={() => this.handleClick(0)}>
            <img src={IconLogin} id="loginicon" width="30" height="30"/>
          </div>
          <div className="navButton" onClick={() => this.handleClick(1)}>
            <img src={IconRegister} id="registericon" width="30" height="30"/>
          </div>
          <div className="navButton" onClick={() => this.handleClick(2)}>
            <img src={IconInfo} id="infoicon" width="30" height="30"/>
          </div>
          <div className="navButton" onClick={() => this.handleClick(3)}>
            <img src={IconSettings} id="settignsicon" width="30" height="30"/>
         </div>
          <div className="navButton" onClick={() => this.handleClick(4)}>
            <img src={IconChat} id="chaticon" width="30" height="30"/>
          </div>
          <div className="notifButton" onClick={() => this.handleNotifClick()}>
            <img src={IconNotif} id="notificon" width="30" height="30"/>
          </div>
          <RenderNotifs status={this.state.showNotif} />
      </div>
        <CurPage page={this.state.curPage} />
      </div>
    )
  }
}

export default App;
