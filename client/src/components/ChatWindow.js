import React, { Component } from "react";
import './style/ChatWindow.css';
import IconSend from '../images/icon_send.svg';
export default class ChatWindow extends Component {

    render() {
        //contactList should be something that is received from the server
        const contactList = 'Yan,Kevin,Milo,Sud,Aman,Eggert,Eggboi,Eggs,SunnySideUp,Omelette,Sud,Aman,Eggert,Eggboi,Eggs,SunnySideUp,Omelette'.split(',');


        var renderedOutput = contactList.map(item => <div className="contact">{item}</div>)
        return (
            <div className = "chatWindow">
                <div className="contactsList">
                    {renderedOutput}
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
