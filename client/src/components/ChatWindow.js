import React, { Component } from "react";
import './style/ChatWindow.css';
import IconSend from '../images/icon_send.svg';
import {Redirect} from "react-router-dom";
import {isLoggedIn} from '../utils.js';

export default class ChatWindow extends Component {

    constructor(props)
    {
        super(props);
        this.state = {loggedIn: true};
    }
    componentDidMount() //we need to make sure we are actually logged in
    {                   
        console.log("Inside component did mount for chat window");
        isLoggedIn().then(loggedIn => this.setState({loggedIn: loggedIn}));
    }

    render() {

        if(this.state.loggedIn == false)
        {
            return <Redirect to='/login' />;
        }
        //contactList should be something that is received from the server
        const contactList = 'Yan,Kevin,Milo,Sud,Aman,Eggert,Eggboi,Eggs,SunnySideUp,Omelette,Sud,Aman,Eggert,Eggboi,Eggs,SunnySideUp,Omelette'.split(',');

        var renderedOutput = contactList.map(item => <div className="contact">{item}</div>)
        console.log("inside chatwindow");
        return (
            <div className="chatWindow">
                <div className="sidebar">
                    <div className="searchorcreate">
                        <div className="inputField2">
                            <form onSubmit={this.handleSubmit}>
                                <input
                                    type="text"
                                    class="searchbar-input"
                                    placeholder="Search friends..."
                                />
                                <input
                                    type="submit"
                                    class="message-send"
                                    value=""
                                />
                            </form>
                        </div>
                    </div>
                    <div className="contactsList">
                        {renderedOutput}
                    </div>
                </div>
                <div className="curChat">
                    <div className="inputField">
                        <form onSubmit={this.handleSubmit}>
                            <input
                                type="text"
                                class="message-input"
                                placeholder="Type a message..."
                            />
                            <input
                                type="submit"
                                class="message-send"
                                value=""
                            />
                        </form>
                    </div>
                    <div className="messages">
                        <div className="received">
                            You just recieved this message from another user
                        </div>
                        <div className="sent">
                            You just sent this message to another user
                        </div>
                        <div className="received">
                            You just recieved this message from another user
                        </div>
                        <div className="sent">
                            You just sent this message to another user
                        </div>
                        <div className="received">
                            You just recieved this message from another user
                        </div>
                        <div className="sent">
                            You just sent this message to another user
                        </div>
                        <div className="received">
                            You just recieved this message from another user
                        </div>
                        <div className="sent">
                            You just sent this message to another user
                        </div>
                        <div className="received">
                            You just recieved this message from another user
                        </div>
                        <div className="sent">
                            You just sent this message to another user
                        </div>
                        <div className="received">
                            You just recieved this message from another user
                        </div>
                        <div className="sent">
                            You just sent this message to another user
                        </div>
                        <div className="received">
                            You just recieved this message from another user
                        </div>
                        <div className="sent">
                            You just sent this message to another user
                        </div>
                        <div className="received">
                            You just recieved this message from another user
                        </div>
                        <div className="sent">
                            You just sent this message to another user
                        </div>
                        <div className="received">
                            You just recieved this message from another user
                        </div>
                        <div className="sent">
                            You just sent this message to another user
                        </div>
                        <div className="received">
                            You just recieved this message from another user
                        </div>
                        <div className="sent">
                            You just sent this message to another user
                        </div>
                        <div className="received">
                            You just recieved this message from another user
                        </div>
                        <div className="sent">
                            You just sent this message to another user
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
