import React from 'react';
import { Link } from 'react-router-dom';
import './style/Nav.css';
import {isLoggedIn} from '../utils.js';
import IconLogin from '../images/icon_login.svg';
import IconSettings from '../images/icon_settings.svg';
import IconInfo from '../images/icon_info.svg';
import IconSignup from '../images/icon_register.svg';
import IconChat from '../images/icon_chat.svg';
import IconContactUs from '../images/icon_contactus.svg';
import IconSearch from '../images/icon_search.svg';
import IconNotif from '../images/icon_notif.svg';
import IconFriendReqs from '../images/friend_requests.svg';

export default class Nav extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loggedIn: false,
            curPage: '',
        }
    }
    componentDidMount() //we need to make sure we are actually logged in
    {                   
        console.log("Inside component did mount for navbar");
        var page = '';
        switch(window.location['pathname'])
        {
            case '/chats': page = 'Chats'; break;
            case '/chatapp': page = 'Log In'; break;
            case '/about': page = 'About'; break;
            case '/search': page = 'Search for users'; break;
            case '/settings/general': page = 'Settings'; break;
            case '/settings/appearance': page = 'Settings'; break;
            case '/settings/signout': page = 'Settings'; break;
            case '/friendrequests': page = 'Friend requests'; break;
            case '/signup': page = 'Sign Up'; break;
            case '/login': page = 'Log In'; break;
            default: page = 'Add a specific case for this url on nav.js'; break;
        }
        isLoggedIn().then(loggedIn => this.setState({loggedIn: loggedIn, curPage: page}));

    }

    render() {
        if(this.state.loggedIn == false)
        {
            return (
                <div className="main">
                    <div className="navigation1">
                        <div className="page-title">{this.state.curPage}</div>
                        <Link to="/login" className="navButton" onClick={() => this.setState({curPage: 'Log In'})}>
                            Log In
                        </Link>
                        or
                        <Link to="/signup" className="navButton" onClick={() => this.setState({curPage: 'Sign Up'})}>
                            Sign Up
                        </Link>
                        <Link to="/about" className="navButton" onClick={() => this.setState({curPage: 'About'})}>
                            <img src={IconInfo} width="30" height="30" />
                        </Link>
                    </div>
                </div>
            );
        }
        return (
                <div className="main">
                    <div className="navigation1">
                    <div className="page-title">{this.state.curPage}</div>
                        <Link to="/about" className="navButton" onClick={() => this.setState({curPage: 'About'})}>
                            <img src={IconInfo} width="30" height="30" />
                        </Link>
                        <Link to="/settings/general" className="navButton" onClick={() => this.setState({curPage: 'Settings'})}>
                            <img src={IconSettings} width="30" height="30" />
                        </Link>
                        <Link to="/chats" className="navButton" onClick={() => this.setState({curPage: 'Chats'})}>
                            <img src={IconChat} width="30" height="30" />
                        </Link>
                        <Link to="/friendrequests" className="navButton" onClick={() => this.setState({curPage: 'Friend Requests'})}>
                            <img src={IconFriendReqs} width="30" height="30" />
                        </Link>
                        <Link to="/search" className="navButton" onClick={() => this.setState({curPage: 'Search for Users'})}>
                            <img src={IconSearch} width="30" height="30" />
                        </Link>
                    </div>
                </div>
        );
        
        
    }
}