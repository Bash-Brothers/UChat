import React from 'react';
import { Link } from 'react-router-dom';
import './style/Nav.css';
import {isLoggedIn} from '../utils.js';
import IconSettings from '../images/icon_settings.svg';
import IconInfo from '../images/icon_info.svg';
import IconChat from '../images/icon_chat.svg';
import IconSearch from '../images/icon_search.svg';
import IconFriendReqs from '../images/friend_requests.svg';
import Logo from '../images/logotest.png';

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
            default: page = ''; break;
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
                            <img src={IconInfo} className="navIcon"/>
                        </Link>
                    </div>
                </div>
            );
        }
        return (
                <div className="main">
                    <div className="navigation1">
                    <img src={Logo} className="navbarLogo"/>
                    <div className="page-title">{this.state.curPage}</div>
                        <Link to="/chats" className="navButton" onClick={() => this.setState({curPage: 'Chats'})}>
                            <img src={IconChat} className="navIcon"/>
                        </Link>
                        <Link to="/friendrequests" className="navButton" onClick={() => this.setState({curPage: 'Friend Requests'})}>
                            <img src={IconFriendReqs} className="navIcon"/>
                        </Link>
                        <Link to="/search" className="navButton" onClick={() => this.setState({curPage: 'Search for Users'})}>
                            <img src={IconSearch} className="navIcon"/>
                        </Link>
                        <Link to="/settings/general" className="navButton" onClick={() => this.setState({curPage: 'Settings'})}>
                            <img src={IconSettings} className="navIcon"/>
                        </Link>
                        <Link to="/about" className="navButton" onClick={() => this.setState({curPage: 'About'})}>
                            <img src={IconInfo} className="navIcon"/>
                        </Link>
                    </div>
                </div>
        );
        
        
    }
}