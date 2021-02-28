import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch, Link } from "react-router-dom";
import './App.css';
import Settings from './components/Settings.js';
import ChatWindow from './components/ChatWindow.js';
import LoginPage from './components/LoginPage.js';
import About from './components/About.js';
import SignupPage from './components/SignupPage.js';
import ContactUsPage from './components/ContactUsPage.js';
import SearchPage from './components/SearchPage.js';
import Test from './components/Test.js';
import Nav from './components/Nav.js';
import Page404 from './components/Page404.js';

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
      response: '',
      post: '',
      responseToPost: '',
    };
    /*this.CurNav = this.CurNav.bind(this);
    this.mainNav = this.mainNav.bind(this);
    this.LogInNav = this.CurNav.bind(this);*/
  }
  //curPage values: Log in page: 0, Sign up page: 1, About page: 2, Settings page: 3, Chats page: 4
  //loggedIn state variable is to make sure someone is logged in before they can click on settings or chats

  callApi = async () => {
    const response = await fetch('/');
    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);

    return body;
  };

  componentDidMount() {
    this.callApi()
      .then(res => this.setState({ response: res.express }))
      .catch(err => console.log(err));
  }

  handleSubmit = async e => {
    e.preventDefault();
    const response = await fetch('/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ post: this.state.post }),
    });
    const body = await response.text();

    this.setState({ responseToPost: body });
  };


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

  render() {
    return (
      <div className="App">
        <Router>
          <div>
            <Nav />
            <Switch>
              <Route path="/about">
                <About />
              </Route>
              <Route path="/signup">
                <SignupPage />
              </Route>
              <Route path="/login">
                <LoginPage/>
              </Route>
              <Route path="/chats">
                <ChatWindow/>
              </Route>
              <Route path="/search">
                <SearchPage/>
              </Route>
              <Route path="/contactus">
                <ContactUsPage/>
              </Route>
              <Route path="/settings">
                <Settings/>
              </Route>
              <Route path="/search">
                <SearchPage />
              </Route>
              <Route path="/">
                <LoginPage />
              </Route>
            </Switch>
          </div>
        </Router>
      </div>
    )
  }
}

export default App;
