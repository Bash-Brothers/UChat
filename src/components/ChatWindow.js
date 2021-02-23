import React, { Component } from "react";
import './style/ChatWindow.css';
import IconSend from '../images/icon_send.svg';
export default class ChatWindow extends Component {
    render() {
        return (
            <div className = "chatWindow">
                <div className="contactsList">
                    <div className="contact">
                        contactName1
                    </div>
                    <div className="contact">
                        contactName
                    </div>
                    <div className="contact">
                        contactName
                    </div>
                    <div className="contact">
                        contactName
                    </div>
                    <div className="contact">
                        contactName
                    </div>
                    <div className="contact">
                        contactName
                    </div>
                    <div className="contact">
                        contactName
                    </div>
                    <div className="contact">
                        contactName
                    </div>
                    <div className="contact">
                        contactName
                    </div>
                    <div className="contact">
                        contactName
                    </div>
                    <div className="contact">
                        contactName
                    </div>
                    <div className="contact">
                        contactName
                    </div>
                    <div className="contact">
                        contactName
                    </div>
                    <div className="contact">
                        contactName
                    </div>
                    <div className="contact">
                        contactName
                    </div>
                    <div className="contact">
                        contactName
                    </div>
                    <div className="contact">
                        contactName
                    </div>
                    <div className="contact">
                        contactName
                    </div>
                    <div className="contact">
                        contactName
                    </div>
                    <div className="contact">
                        contactName
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
                    </div>
                </div>
            </div>
        )
    }
}
