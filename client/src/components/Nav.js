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
        }
    }
    componentDidMount() //we need to make sure we are actually logged in
    {                   
        console.log("Inside component did mount for navbar");
        isLoggedIn().then(loggedIn => this.setState({loggedIn: loggedIn}));
    }

    render() {
        if(this.state.loggedIn == false)
        {
            return (
                <div className="main">
                    <div className="navigation1">

                        <Link to="/login" className="navButton">
                            <img src={IconLogin} width="30" height="30" />
                        </Link>
                        <Link to="/signup" className="navButton">
                            <img src={IconSignup} width="30" height="30" />
                        </Link>
                        <Link to="/about" className="navButton">
                            <img src={IconInfo} width="30" height="30" />
                        </Link>
                        <Link to="/contactus" className="navButton">
                            <img src={IconContactUs} width="30" height="30" />
                        </Link>
                    </div>
                </div>
            );
        }
        return (
                <div className="main">
                    <div className="navigation1">
                        <Link to="/about" className="navButton">
                            <img src={IconInfo} width="30" height="30" />
                        </Link>
                        <Link to="/settings/general" className="navButton">
                            <img src={IconSettings} width="30" height="30" />
                        </Link>
                        <Link to="/chats" className="navButton">
                            <img src={IconChat} width="30" height="30" />
                        </Link>
                        <Link to="/friendrequests" className="navButton">
                            <img src={IconFriendReqs} width="30" height="30" />
                        </Link>
                        <Link to="/search" className="navButton">
                            <img src={IconSearch} width="30" height="30" />
                        </Link>
                        <Link to="/contactus" className="navButton">
                            <img src={IconContactUs} width="30" height="30" />
                        </Link>
                    </div>
                </div>
        );
        
        
    }
}