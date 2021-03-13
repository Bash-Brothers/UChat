import React, { Component } from "react";
import './style/ChatWindow.css';
import { Redirect } from "react-router-dom";
import { isLoggedIn, getUserInfo } from '../utils.js';
import defImg from '../images/icon_image.svg';


// display media widget if the media button is clicked, handle clicks within the widget

class MediaWidget extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            img: defImg,
            display: 1,
        }
        this.generatePreview = this.generatePreview.bind(this);
        this.backClick = this.backClick.bind(this);
    }



    handleLatexSubmit = async (event) => { //sends LaTeX input to renderer, posts returned URL to chat
        event.preventDefault();
        var latex = document.getElementById("latexEditor").value

        latex = latex.replace(/\n/g, '');
        latex = "\\documentclass{article}\\begin{document}" + latex + "\\pagenumbering{gobble}\\end{document}"
        // append document and page number tags
        const latexJSON = JSON.stringify({ latex: latex })

        // perform POST to backend to receive rendered LaTeX URL
        const latexResult = await fetch("/latexRequest",
            {
                method: 'POST',
                headers: {
                    'Content-Type': "application/json",
                },
                body: latexJSON
            })
        const latexReturn = await latexResult.json()
        const filename = await latexReturn.filename;

        // perform POST to backend to send message payload

        const fetchurl = "/sendchat/" + this.props.curChat;
        const newMessage = { chat_id: this.props.curChat, sender: this.props.curUser, message: filename, time: this.props.getCurrentTime(), type: "latex" };
        const result = await fetch("/sendchat/" + this.props.curChat,
            {
                method: 'POST',
                headers: {
                    'Content-Type': "application/json; charset=utf-8",
                },
                body: JSON.stringify(newMessage)
            })

        const res = await result.json();  /* {returnCode} */

        const returnCode = await res.returnCode;

        if (returnCode != 0) {
            console.log("error sending chat");
            return null;
        }

        event.target.reset();

    }

    handleImageSubmit = async (event) => { // sends uploaded image to imgur, posts returned URL to chat
        event.preventDefault();
        var formData = new FormData();
        const fileInput = document.getElementById('imageUpload');
        if (fileInput.files.length == 0 || fileInput.files[0] == defImg) {
            console.log("no files selected");
            //create an alert based on if registration is successful or not
            document.getElementById('alert-red').innerHTML = 'No image attached!';
            document.getElementById('alert-red').style.width = "10vw";
            document.getElementById('alert-red').style.visibility = 'visible';
            setTimeout(function () {
                document.getElementById('alert-red').style.visibility = 'hidden';
            }, 3000); // <-- time in milliseconds
            return;
        }
        const file = fileInput.files[0];
        formData.append('image', file);
        
        const uploadResult = await fetch('https://api.imgur.com/3/image', { //perform post to imgur API
            method: 'POST',
            headers: {
                'Authorization': 'Client-ID 0c9e599528444e7',
            },
            body: formData
        })
        const uploadReturn = await uploadResult.json();

        // perform POST to backend to send message payload

        const fetchurl = "/sendchat/" + this.props.curChat;
        const newMessage = { chat_id: this.props.curChat, sender: this.props.curUser, message: uploadReturn.data.link, time: this.props.getCurrentTime(), type: "image" };
        const result = await fetch("/sendchat/" + this.props.curChat,
            {
                method: 'POST',
                headers: {
                    'Content-Type': "application/json; charset=utf-8",
                },
                body: JSON.stringify(newMessage)
            })

        const res = await result.json();  /* {returnCode} */

        const returnCode = await res.returnCode;

        if (returnCode != 0) {
            console.log("error sending chat");
            return null;
        }
        this.setState({ img: defImg });
        event.target.reset();
    }

    generatePreview(event) {
        this.setState({ img: URL.createObjectURL(event.target.files[0]) });
    }

    backClick(i) {
        if (i == 3) {
            this.setState({ img: defImg })
        }
        this.setState({ display: i })
    }

    render() { //render the media widget 
        const status = this.props.status; //used to determine whether to display the media widget at all
        if(status) {
            if (this.state.display === 1) { //render the default view on media button click or back click
                return (
                    <div className="mediaWidget">
                        <div className="mediaLatex" onClick={() => this.backClick(2)} />
                        <div className="mediaUploadImage" onClick={() => this.backClick(3)} />
                    </div>
                )
            }
            else if (this.state.display === 2) {  //render the latex widget on latex button click
                return (
                    <div className="latexWidget">
                        <div className="widgetHeader">
                            <div className="button-back" onClick={() => this.backClick(1)} />
                        </div>
                        <form onSubmit={this.handleLatexSubmit}>
                            <textarea className="latexInput" id="latexEditor" placeholder="Enter LaTeX code..." />
                            <input className="widgetSend" type="submit" value="Send" />
                        </form>
                    </div>
                )
            }
            else if (this.state.display === 3) { //render the image input widget
                return (
                    <div className="imageWidget">
                        <div className="widgetHeader">
                            <div className="button-back" onClick={() => this.backClick(1)} />
                        </div>
                        <form id='imgform' onSubmit={this.handleImageSubmit}>
                            <input type="file" id="imageUpload" name="imagename" onChange={this.generatePreview} hidden />
                            <label for="imageUpload">
                                <div><img src={this.state.img} id="preview" /></div>
                                <input className="widgetSend" type="submit" value="Send" />
                            </label>
                        </form>
                    </div>
                )
            }
        }
        return (null);
    }
}



// main page class

export default class ChatWindow extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loggedIn: true,
            curUser: null, // stores the username of the person logged in
            curChat: null, //stores the chatId of current chat
            curChatName: null,  // person(s) usr is chatting w/
            chatsList: null, // list of chats the user has 
            messageList: null, // list of messages in the current chat
            curMessage: null, // current message to be sent
            intervalID: null, // interval for message refresh
            mediaState: 0,  // 0 for not showing, 1 for showing

        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleMediaClick = this.handleMediaClick.bind(this);
    }

    getChat = async (chat_id) => {

        const fetchurl = "/chat/" + chat_id;
        const result = await fetch(fetchurl,
            {
                method: 'GET',
                headers: {
                    'Content-Type': "application/json; charset=utf-8",
                },
            })

        const res = await result.json();  /* {returnCode, messages, participants} */

        const returnCode = await res.returnCode;

        if (returnCode != 0) {
            console.log("error accessing messages");
            return null;
        }

        return res;

    }

    // gets the updated list of messages and sets state.
    // called every 3 seconds
    async getData() {
        try {
            const curChatInfo = await this.getChat(this.state.curChat);
            const messageList = curChatInfo.messages;
            this.setState({ messageList: messageList });
        }
        catch {
            console.log("user has no chat data");
        }
    }

    async componentDidMount() //action to take as soon as enter the page
    {
        const loggedIn = await isLoggedIn();
        if (!loggedIn) {
            this.setState({ loggedIn: false });
        }

        const userInfo = await getUserInfo(); // about current user
        const curUser = userInfo.username;

        const chatsList = userInfo.chats;
        if (chatsList.length > 0) {
            const curChat = userInfo.chats[0].chat_id;  // most recent chat is displayed by default
            const curChatInfo = await this.getChat(curChat);

            var chatParticipants = [];
            try {
                chatParticipants = curChatInfo.participants;
            }
            catch {
                chatParticipants = [];
            }

            const chatName = (chatParticipants[0] == curUser) ? chatParticipants[1] : chatParticipants[0];

            var messageList = []
            try {
                messageList = curChatInfo.messages;
            }
            catch {
                messageList = []
            }

            // get updated list of messages every 3 seconds
            this.intervalID = setInterval(this.getData.bind(this), 3000)

            this.setState({
                loggedIn: loggedIn, curUser: curUser, curChat: curChat,
                curChatName: chatName, messageList: messageList,
                chatsList: chatsList,
            });
        }
        else {
            // get updated list of messages every 3 seconds
            this.intervalID = setInterval(this.getData.bind(this), 3000)
            this.setState({ loggedIn: loggedIn, curUser: curUser, });
        }

    }

    componentWillUnmount() {
        // stop interval once we exit this page
        clearInterval(this.intervalID);
    }

    async changeChat(newChat) {
        const curChatInfo = await this.getChat(newChat);

        const chatParticipants = curChatInfo.participants;

        const chatName = (chatParticipants[0] == this.state.curUser) ? chatParticipants[1] : chatParticipants[0];

        const messageList = curChatInfo.messages;

        this.setState({
            curChat: newChat,
            curChatName: chatName, messageList: messageList,
        });

    }

    getCurrentTime() {
        var today = new Date();
        var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
        var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        var dateTime = date + ' ' + time;

        return dateTime
    }

    handleChange = (event) => {
        const newMessage = { chat_id: this.state.curChat, sender: this.state.curUser, message: event.target.value, time: this.getCurrentTime(), type: "text" };
        this.setState({ curMessage: newMessage });
    }

    handleSubmit = async (event) => {
        event.preventDefault();
        const fetchurl = "/sendchat/" + this.state.curChat;
        const result = await fetch("/sendchat/" + this.state.curChat,
            {
                method: 'POST',
                headers: {
                    'Content-Type': "application/json; charset=utf-8",
                },
                body: JSON.stringify(this.state.curMessage)
            })

        const res = await result.json();  /* {returnCode} */

        const returnCode = await res.returnCode;

        if (returnCode != 0) {
            console.log("error sending chat");
            return null;
        }

        event.target.reset();

    }
    //handle clicks on the media button
    handleMediaClick() {
        this.setState({mediaState: !(this.state.mediaState)})

    }



    render() {
        if (this.state.loggedIn == false) {
            return <Redirect to='/login' />;
        }
        if (this.state.curUser == null) {
            return (<div> Loading </div>);
        }

        //chatsList (which is the list of contacts) is received from the server

        const chatsList = this.state.chatsList;
        console.log("chatsList = ", chatsList)
        try {
            var renderedContacts = chatsList.map(chat =>
                (chat.chat_name === this.state.curChatName) ?
                    <div className="contact-active" onClick={() => this.changeChat(chat.chat_id)}>{chat.chat_name}</div> :
                    <div className="contact" onClick={() => this.changeChat(chat.chat_id)}>{chat.chat_name}</div>
            );
        }
        catch {
            var renderedContacts = null;
        }

        const messages = this.state.messageList;
        var renderedMessages;
        if (renderedContacts === null) {
            renderedMessages = <div className="no-chats">Looks like you have no chats. <a href="/search" class="link">Add a user</a> to get started.</div>
        }
        else if (messages === null || messages.length == 0) //if a chat with curChat id has no messages, display a no messages div
        {
            renderedMessages = <div className="no-messages">Looks like this chat has no messages!</div>
        }
        else // otherwise render the messages
        {
            renderedMessages = messages.slice(0).reverse().map((messageObj) => {
                let sender = messageObj['sender'];
                let message = messageObj['message'];
                let time = messageObj['time'];
                let type = messageObj['type'];    

                // extract the timestamp from the message data
                var timePatternHours = /([0-9]|[0-9][0-9]):(?=(([0-9]|[0-9][0-9]):))/g
                var timePatternMinutes = /(?<=([0-9]|[0-9][0-9]):)([0-9]|[0-9][0-9])(?=:)/g
                let formattedTime = time.match(timePatternHours)
                let formattedMinutes = time.match(timePatternMinutes)
                if (formattedMinutes[0].length === 2) {
                    formattedTime += formattedMinutes
                } else {
                    formattedTime += '0' + formattedMinutes
                }


                if (sender === this.state.curUser) {
                    if (type === "latex") {
                        return (
                            <div className="sent">
                                <div className="messageText">
                                    <img className="messageLatexSent" src={message} />
                                </div>
                                <div className="messageTimeSent">
                                    {formattedTime}
                                </div>
                            </div>
                        )
                    } else if (type === "image") {
                        return (
                            <div className="sent">
                                <div className="messageText">
                                    <img className="messageImage" src={message} />
                                </div>
                                <div className="messageTimeSent">
                                    {formattedTime}
                                </div>
                            </div>
                        )
                    }

                    return (
                        <div className="sent">
                            <div className="messageText">
                                {message}
                            </div>
                            <div className="messageTimeSent">
                                {formattedTime}
                            </div>
                        </div>
                    );
                }
                else {
                    if (type === "latex") {
                        return (
                            <div className="received">
                                <div className="messageText">
                                    <img className="messageLatexReceived" src={message} />
                                </div>
                                <div className="messageTimeSent">
                                    {formattedTime}
                                </div>
                            </div>
                        )
                    } else if (type === "image") {
                        return (
                            <div className="received">
                                <div className="messageText">
                                    <img className="messageImage" src={message} />
                                </div>
                                <div className="messageTimeSent">
                                    {formattedTime}
                                </div>
                            </div>
                        )
                    }
                    return (
                        <div className="received">
                            <div className="messageText">
                                {message}
                            </div>
                            <div className="messageTimeReceived">
                                {formattedTime}
                            </div>
                        </div>
                    );
                }
            })
        }

        return (
            <div className="chatWindow">
                <div className="sidebar">
                    <div className="contactsList">
                        {renderedContacts}
                    </div>
                </div>
                <div className="curChat">
                    <div className="inputField">
                        <div className="button-media" onClick={() => this.handleMediaClick()} />
                        <form onSubmit={this.handleSubmit}>
                            <input
                                type="text"
                                className="message-input"
                                placeholder="Type a message..."
                                onChange={this.handleChange}
                                value={this.state.msg_value}
                            />
                            <input className="message-send" type="submit" value="" />

                        </form>
                    </div>
                    <div className="messages">
                        <MediaWidget
                            status={this.state.mediaState}
                            onClick={(i) => this.handleMediaClick(i)}
                            getCurrentTime={this.getCurrentTime}
                            {...this.state} />
                        {renderedMessages}
                    </div>
                    <div className="currentChatTo">
                        {this.state.curChatName}
                    </div>
                </div>
            </div>
        )
    }
}
