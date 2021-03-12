import React, { Component } from "react";
import './style/ChatWindow.css';
import IconSend from '../images/icon_send.svg';
import IconLatex from '../images/icon_latex.svg';
import IconImage from '../images/icon_image.svg';
import IconBack from '../images/icon_back.svg';
import IconSearch from '../images/icon_search.svg';
import { Redirect } from "react-router-dom";
import { isLoggedIn, getUserInfo } from '../utils.js';
import defImg from '../images/icon_image.svg';


//display media widget if the media button is clicked, handle clicks within the widget


class MediaWidget extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            img: defImg,
            status: 1,
        }
        this.generatePreview = this.generatePreview.bind(this);
        this.backClick = this.backClick.bind(this);
    }

    handleLatexSubmit = async (event) => {
        event.preventDefault();
        console.log("Inside handleLatexSubmit");
        var latex = document.getElementById("latexEditor").value

        latex = latex.replace(/\n/g, '');
        latex = "\\documentclass{article}\\begin{document}" + latex + "\\pagenumbering{gobble}\\end{document}"
        const latexJSON = JSON.stringify({ latex: latex })


        const latexResult = await fetch("/latexRequest",
            {
                method: 'POST',
                headers: {
                    'Content-Type': "application/json",
                },
                body: latexJSON
            })
        const latexReturn = await latexResult.json()
        const filename = await latexReturn.filename;    //supposed to get filename from latexRequest

        const fetchurl = "/sendchat/" + this.props.curChat;
        console.log("inside handleLatexSubmit, fetchurl = ", fetchurl);
        const newMessage = { chat_id: this.props.curChat, sender: this.props.curUser, message: filename, time: this.props.getCurrentTime(), type: "latex" };
        console.log(newMessage)
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

    handleImageSubmit = async (event) => {
        event.preventDefault();
        var formData = new FormData();
        const fileInput = document.getElementById('imageUpload');
        if (fileInput.files.length == 0 || fileInput.files[0] == defImg) {
            console.log("no files selected");
            //create an alert based on if registartion is successful or not
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
        //document.getElementById('placeholderImage').style.backgroundImage = this.state.img;

        console.log(formData)

        const uploadResult = await fetch('https://api.imgur.com/3/image', {
            method: 'POST',
            headers: {
                'Authorization': 'Client-ID 0c9e599528444e7',
            },
            body: formData
        })
        const uploadReturn = await uploadResult.json();
        const fetchurl = "/sendchat/" + this.props.curChat;
        console.log("inside handleLatexSubmit, fetchurl = ", fetchurl);
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
        this.setState({ status: i })
    }

    render() {
        const status = this.state.status;
        if (status === 1) {
            return (
                <div className="mediaWidget">
                    <div className="mediaLatex" onClick={() => this.backClick(2)} />
                    <div className="mediaUploadImage" onClick={() => this.backClick(3)} />
                </div>
            )
        }
        else if (status === 2) {  //render the latex widget on latex button click
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
        else if (status === 3) { //render the image input widget
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
        return (null);
    }
}





export default class ChatWindow extends Component {

    constructor(props) {
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
            mediaState: 0,  //0 for not showing, 1 for menu, 2 for latex input, 3 for image input

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
    // called every 5 seconds

    //TO DO, replace with faster implementation
    async getData() {
        // console.log(window.location['pathname']);
        //console.log("Getting data");
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
        //console.log("Inside component did mount for chat window");
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

            //console.log("curChatInfo = ", curChatInfo);

            var chatParticipants = [];
            try {
                chatParticipants = curChatInfo.participants;
            }
            catch {
                alert('curchatinfo is null')
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

            // get updated list of messages every 5 seconds
            this.intervalID = setInterval(this.getData.bind(this), 5000)

            this.setState({
                loggedIn: loggedIn, curUser: curUser, curChat: curChat,
                curChatName: chatName, messageList: messageList,
                chatsList: chatsList,
            });
        }
        else {
            // get updated list of messages every 5 seconds
            this.intervalID = setInterval(this.getData.bind(this), 5000)
            this.setState({ loggedIn: loggedIn, curUser: curUser, });
        }

    }

    componentWillUnmount() {
        // stop interval once we exit this page
        //console.log("Inside will unmount , intervalID = ", this.intervalID);
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
        //console.log("Inside handleChange");
        const newMessage = { chat_id: this.state.curChat, sender: this.state.curUser, message: event.target.value, time: this.getCurrentTime(), type: "text" };
        //console.log("Inside handleChange, newMessage = ", newMessage);
        this.setState({ curMessage: newMessage });
    }

    handleSubmit = async (event) => {
        event.preventDefault();
        //console.log("Inside handleSubmit");
        const fetchurl = "/sendchat/" + this.state.curChat;
        //console.log("inside handleSubmit, fetchurl = ", fetchurl);
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
        // this.setState({msg_value: ""}); // clear form entry

    }
    //handle clicks on the media button
    handleMediaClick(i) {
        switch (i) {
            case 0: // media button clicked
                if (this.state.mediaState === 0)
                    this.setState({ mediaState: 1, })
                else
                    this.setState({ mediaState: 0, })
                break;
            case 1: // latex button clicked
                this.setState({ mediaState: 2, })
                break;
            case 2: // image button clicked
                this.setState({ mediaState: 3, })
                break;
            case 3: // back button clicked
                this.setState({ mediaState: 1, })
                break;

        }

    }



    render() {
        if (this.state.loggedIn == false) {
            //alert('Log in to view chats!');
            return <Redirect to='/login' />;
        }
        if (this.state.curUser == null) {
            return (<div> Loading </div>);
        }

        //contactList should be something that is received from the server
        // const contactList = [{user: 'Sud', chatId: 0}, {user: 'Eggert', chatId: 2},  {user: 'Musk', chatId: 1}]

        const chatsList = this.state.chatsList;
        //console.log("chatsList = ", chatsList)
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
                let type = messageObj['type'];    //get message type from backend (temporarily using type 0 = text, type 1 = image)
                /*This timestamp extraction code may be inefficient
                It also only uses 24 hour time, and doesn't extract dates
                (we'll probably need to use some other logic for displaying dates anyways, since usually dates are only displayed once per day)
                */
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

        //console.log("inside chatwindow");
        return (
            <div className="chatWindow">
                <div className="sidebar">
                    {/*
                        ===========================================================
                        TODO: implement chat page search bar functionality
                        For now, hide because it looks ugly and doesn't do anything
                        ===========================================================
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
                                    class="searchbar-send"
                                    value=""
                                />
                            </form>
                        </div>
                    </div>
                    */}
                    <div className="contactsList">
                        {renderedContacts}
                    </div>
                </div>
                <div className="curChat">
                    <div className="inputField">
                        <div className="button-media" onClick={() => this.handleMediaClick(0)} />
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
