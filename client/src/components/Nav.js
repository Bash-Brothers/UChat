import React from 'react';
import { Link } from 'react-router-dom';
import './style/Nav.css';

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
    render() {
        return (
            <div className="main">
                <div className="navigation1">
                    <Link to="/login" className="navButton">
                        <img src={IconLogin} id="loginicon" width="30" height="30" />
                    </Link>
                    <Link to="/signup" className="navButton">
                        <img src={IconSignup} id="loginicon" width="30" height="30" />
                    </Link>
                    <Link to="/about" className="navButton">
                        <img src={IconInfo} id="loginicon" width="30" height="30" />
                    </Link>
                    <Link to="/settings/general" className="navButton">
                        <img src={IconSettings} id="loginicon" width="30" height="30" />
                    </Link>
                    <Link to="/chats" className="navButton">
                        <img src={IconChat} id="loginicon" width="30" height="30" />
                    </Link>
                    <Link to="/friendrequests" className="navButton">
                        <img src={IconFriendReqs} id="loginicon" width="30" height="30" />
                    </Link>
                    <Link to="/search" className="navButton">
                        <img src={IconSearch} id="loginicon" width="30" height="30" />
                    </Link>
                    <Link to="/contactus" className="navButton">
                        <img src={IconContactUs} id="loginicon" width="30" height="30" />
                    </Link>
                </div>
            </div>
        );
    }
}