import React, { Component } from "react";
import './style/ChatWindow.css';
import IconSend from '../images/icon_send.svg';
import {Redirect} from "react-router-dom";
import {isLoggedIn, getUserInfo} from '../utils.js';

export default class ChatWindow extends Component {

    constructor(props)
    {
        super(props);
        this.state = {
            loggedIn: true,
            curUser: null, // stores the username of the person logged in
            curChat: null, //stores the chatId of current chat
            curChatName: null,  // person(s) usr is chatting w/
            chatsList: null,
            messageList: null,
            curMessage: null,
            intervalID: null,
            
        };
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    getChat = async (chat_id) =>{

        const fetchurl = "/chat/"+chat_id;        
        const result = await fetch(fetchurl, 
                  {
                    method: 'GET',
                    headers: {
                      'Content-Type': "application/json; charset=utf-8",
                  },
        })

        const res = await result.json();  /* {returnCode, messages, participants} */

        const returnCode = await res.returnCode;

        if (returnCode != 0)
        {
            console.log("error accessing messages");
            return null;
        }

        return res;
        
    }

    // gets the updated list of messages and sets state.
    // called every 5 seconds

    //TO DO, replace with faster implementation
    async getData() 
    {
        console.log("Getting data");
        try{
            const curChatInfo = await this.getChat(this.state.curChat);
            const messageList = curChatInfo.messages;
            this.setState({messageList: messageList });
        }
        catch{
            console.log("user has no chat data");
        }
    }

    async componentDidMount() //action to take as soon as enter the page
    {                   
        console.log("Inside component did mount for chat window");
        const loggedIn = await isLoggedIn();
        if (!loggedIn)
        {
            this.setState({loggedIn: false});
        }

        const userInfo = await getUserInfo(); // about current user
        const curUser = userInfo.username;  

        const chatsList = userInfo.chats; // note, this won't work for groupchats 
        if(chatsList.length > 0){
            const curChat = userInfo.chats[0];  // most recent chat is displayed by default
            const curChatInfo = await this.getChat(curChat);

            console.log("curChatInfo = ", curChatInfo);

            const chatParticipants = curChatInfo.participants;

            console.log("participants = ", chatParticipants);

            const messageList = curChatInfo.messages;

            // get updated list of messages every 5 seconds
            this.intervalID = setInterval(this.getData.bind(this), 5000)

            this.setState({loggedIn: loggedIn,  curUser: curUser, curChat: curChat, 
                      curChatName: chatParticipants, messageList: messageList, 
                      chatsList: chatsList,  });
        }
        else{
            // get updated list of messages every 5 seconds
            this.intervalID = setInterval(this.getData.bind(this), 5000)
            this.setState({loggedIn: loggedIn,  curUser: curUser, });
        }

        

        
    }
    componentWillUnmount()
    {
        // stop interval once we exit this page
        console.log("Inside will unmount , intervalID = ", this.intervalID);
        clearInterval(this.intervalID);
    }

    async changeChat(newChat)
    {
        const curChatInfo = await this.getChat(newChat);

        const chatParticipants = curChatInfo.participants;

        const messageList = curChatInfo.messages;

        this.setState({curChat: newChat, 
                      curChatName: chatParticipants, messageList: messageList, 
                     });

    }

    getCurrentTime()
    {
        var today = new Date();
        var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
        var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        var dateTime = date+' '+time;

        return dateTime
    }

    handleChange = (event) => {
        console.log("Inside handleChange");
        const newMessage = {chat_id: this.state.curChat, sender: this.state.curUser, message: event.target.value, time: this.getCurrentTime()};
        console.log("Inside handleChange, newMessage = ", newMessage);
        this.setState({curMessage: newMessage});
    }

    handleSubmit = async (event) =>
    {
        event.preventDefault();
        console.log("Inside handleSubmit");
        const fetchurl = "/sendchat/"+this.state.curChat;
        console.log("inside handleSubmit, fetchurl = ", fetchurl);
        const result = await fetch("/sendchat/"+this.state.curChat, 
                  {
                    method: 'POST',
                    headers: {
                      'Content-Type': "application/json; charset=utf-8",
                  },
                  body: JSON.stringify(this.state.curMessage)
        })

        const res = await result.json();  /* {returnCode} */

        const returnCode = await res.returnCode;

        if (returnCode != 0)
        {
            console.log("error sending chat");
            return null;
        }

        this.setState({msg_value: ""}); // clear form entry
        
    }

    render() {

        if(this.state.loggedIn == false)
        {
            //alert('Log in to view chats!');
            return <Redirect to='/login' />;
        }
        if (this.state.curUser == null)
        {
            return (<div> Loading </div>);
        }

        //contactList should be something that is received from the server
        // const contactList = [{user: 'Sud', chatId: 0}, {user: 'Eggert', chatId: 2},  {user: 'Musk', chatId: 1}]

        const chatsList = this.state.chatsList;
        try{
            var renderedContacts = chatsList.map(chat_id => <div className="contact" onClick={() => this.changeChat(chat_id)}>{chat_id}</div>);
        }
        catch{
            var renderedContacts = null;
        }

        // const dummyMessages0 = [{chat_id: 0, sender: "Aman", message: "you son of a bitch, I'm in", time: 97}, {chat_id: 0, sender: "Sud", message: "chat apps are easy money", time: 97}, {chat_id: 0, sender: "Aman", message: "no vaccine tracker sounds better", time: 99}, {chat_id: 0, sender: "Sud", message: "lets build a chatapp" , time: 100}];
        // const dummyMessages1 = [];
        // const dummyMessages2 = [{chat_id: 2, sender: "Aman", message: "...have mercy", time: 97}, {chat_id: 2, sender: "Eggert", message: "gonna sneak 10 questions on gdb on the final", time: 97}, {chat_id: 2, sender: "Aman", message: "no its not", time: 99}, {chat_id: 2, sender: "Eggert", message: "gdb is cool" , time: 100}];
    
        // /let currentList = `dummyMessages${twovar}`;
        // var dummyMessages = dummyMessages0;

        // switch(this.state.curChat)
        // {
        //     case 0: dummyMessages = dummyMessages0; break;
        //     case 1: dummyMessages = dummyMessages1; break;
        //     case 2: dummyMessages = dummyMessages2; break;
        // }
        const messages = this.state.messageList; 
        var renderedMessages;
        if(messages === null || messages.length == 0) //if a chat with curChat id has no messages, display a no messages div
        {
            renderedMessages = <div className="no-messages">Looks like this chat has no messages!</div>
        }
        else // otherwise render the messages
        {
            renderedMessages = messages.slice(0).reverse().map((messageObj) => {
                let sender = messageObj['sender'];
                let message = messageObj['message'];

                if(sender === this.state.curUser)
                {
                    return (<div className="sent">{message}</div>);
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
                            <form>
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
                                onChange = {this.handleChange}
                                value = {this.state.msg_value}
                            />
                        <input type="submit" value="send" />

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
