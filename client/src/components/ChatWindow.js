import React, { Component } from "react";
import './style/ChatWindow.css';
import IconSend from '../images/icon_send.svg';
import {Redirect} from "react-router-dom";
import {isLoggedIn} from '../utils.js';

export default class ChatWindow extends Component {

    constructor(props)
    {
        super(props);
        this.state = {
            loggedIn: true,
            curChat: 0, //stores the chatId of current chat
            curChatName: "Sud",
            curUser: "Aman", // stores the username of the person logged in
        };
    }

    componentDidMount() //we need to make sure we are actually logged in
    {                   
        console.log("Inside component did mount for chat window");
        isLoggedIn().then(loggedIn => this.setState({loggedIn: loggedIn}));
    }

    changeChat(newId, newUser)
    {
        this.setState({
            curChat: newId,
            curChatName: newUser,
        });
    }

    render() {
        if(this.state.loggedIn == false)
        {
            //alert('Log in to view chats!');
            return <Redirect to='/login' />;
        }

        //contactList should be something that is received from the server
        const contactList = [{user: 'Sud', chatId: 0}, {user: 'Eggert', chatId: 2},  {user: 'Musk', chatId: 1}]
        var renderedContacts = contactList.map(contact => <div className="contact" onClick={() => this.changeChat(contact['chatId'], contact['user'])}>{contact['user']}</div>)

        const dummyMessages0 = [{chat_id: 0, sender: "Aman", message: "you son of a bitch, I'm in", time: 97}, {chat_id: 0, sender: "Sud", message: "chat apps are easy money", time: 97}, {chat_id: 0, sender: "Aman", message: "no vaccine tracker sounds better", time: 99}, {chat_id: 0, sender: "Sud", message: "lets build a chatapp" , time: 100}];
        const dummyMessages1 = [];
        const dummyMessages2 = [{chat_id: 2, sender: "Aman", message: "...have mercy", time: 97}, {chat_id: 2, sender: "Eggert", message: "gonna sneak 10 questions on gdb on the final", time: 97}, {chat_id: 2, sender: "Aman", message: "no its not", time: 99}, {chat_id: 2, sender: "Eggert", message: "gdb is cool" , time: 100}];
    
        // /let currentList = `dummyMessages${twovar}`;
        var dummyMessages = dummyMessages0;

        switch(this.state.curChat)
        {
            case 0: dummyMessages = dummyMessages0; break;
            case 1: dummyMessages = dummyMessages1; break;
            case 2: dummyMessages = dummyMessages2; break;
        }
        var renderedMessages;
        if(dummyMessages === undefined || dummyMessages.length == 0) //if a chat with curChat id has no messages, display a no messages div
        {
            renderedMessages = <div className="no-messages">Looks like this chat has no messages!</div>
        }
        else // otherwise render the messages
        {
            renderedMessages = dummyMessages.map((messageObj) => {
                let sender = messageObj['sender'];
                let message = messageObj['message'];

                if(sender === this.state.curUser)
                {
                    return <div className="sent">{message}</div>;
                }
                else
                {
                    return <div className="received">{message}</div>;
                }
            })
        }

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
                        {renderedContacts}
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
                        {renderedMessages}
                    </div>
                    <div className="currentChat">
                        {this.state.curChatName}
                        {this.state.curChat}
                    </div>
                </div>
            </div>
        )
    }
}
