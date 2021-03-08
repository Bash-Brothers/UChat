import React, { Component } from "react";
import './style/FriendRequests.css';
import IconSend from '../images/icon_send.svg';
import {Redirect} from "react-router-dom";
import {isLoggedIn, getUserInfo} from '../utils.js';



function FriendRequest(props) {

    return (
        <div className="friendrequest">
            {/* https://stackoverflow.com/questions/42597602/react-onclick-pass-event-with-parameter */}
            <form onSubmit={() => FriendRequests.handleSubmit(props)}>
                <p class="friendname">{props.value}</p>
                <input
                    type="submit"
                    class="acceptButton"
                    value="Accept"
                    onChange = {FriendRequests.handleChange}
                />
                <input
                    type="submit"
                    class="deleteButton"
                    value="Delete"
                    onChange = {FriendRequests.handleChange}
                />
            </form>
        </div>
      );
  }



export default class FriendRequests extends Component {

    constructor(props)
    {
        super(props);
        this.state = {

            loggedIn: true,
            curUser: null, // stores the username of the person logged in
            friendrequestsList: null,
            curfriendreq: null, //stores the friendrequestId of current friend request
            intervalID: null,



            
            // How do we get the current user's username?
            username: "default",
            // loggedIn: true.valueOf,
            friendreqList: ["Yan", "Kevin", "Milo", "Sud", "Aman"],
            changedfriendrequest: "",
            response: "none",

            //contactList should be something that is received from the server
            // const friendreqList = 'Yan,Kevin,Milo,Sud,Aman,Eggert,Eggboi,Eggs,SunnySideUp,Omelette,Sud,Aman,Eggert,Eggboi,Eggs,SunnySideUp,Omelette'.split(','),
            
            // More dummy strings
            // , Eggert, Eggboi, Eggs, SunnySideUp, Omelette, Sud, Aman, Eggert, Eggboi, Eggs, SunnySideUp, Omelette
        };
    }


    async getUpdatedFriendrequestsList() 
    {
        console.log("Getting updated friend requests list");
        try{
            const userInfo = await getUserInfo();
            const Notifs  = userInfo.notifs; 
            // Note on making sure it is right to call this function using .bind(this)
            this.setState({friendrequestsList: Notifs });
        }
        catch{
            console.log("error: could not retrieve friend requests list");
        }
    }



    async componentDidMount() //action to take as soon as enter the page
    {                   
        console.log("Inside component did mount for friend requests page");
        const loggedIn = await isLoggedIn();
        if (!loggedIn)
        {
            this.setState({loggedIn: false});
        }

        const userInfo = await getUserInfo(); // about current user
        const curUser = userInfo.username;  

        const Notifs  = userInfo.notifs; 
        if(Notifs.length > 0){


            // It is only in the render function that we display the most recent friend requests first

            // Probably don't need this
            // const curfriendreq = Notifs[0];  // most recent friend request is displayed by default

            // A friend request carries no information, 
            // the friend request itself is the only information

            // Here we don't have to keep updating list of friend requests
            // We can update friend requests by refreshing the page?

            // get updated list of friend requests every 5 seconds
            // Not sure whether it is right to call this function using .bind(this)
            this.intervalID = setInterval(this.getUpdatedFriendrequestsList.bind(this), 5000)

            this.setState({loggedIn: loggedIn,  curUser: curUser, friendrequestsList: Notifs,  });
        }
        else{
            // Here we don't have to keep updating list of friend requests
            // We can update friend requests by refreshing the page?
            
            // get updated list of friend requests every 5 seconds
            // Not sure whether it is right to call this function using .bind(this)
            this.intervalID = setInterval(this.getUpdatedFriendrequestsList.bind(this), 5000)

            this.setState({loggedIn: loggedIn,  curUser: curUser, friendrequestsList: null, });
        }
        
    }

    componentWillUnmount()
    {
        // Interval not needed here

        // stop interval once we exit this page
        // console.log("Inside will unmount , intervalID = ", this.intervalID);
        // clearInterval(this.intervalID);
    }


    handleChange = (event) => {
        this.setState({response: event.target.value});
    }


    // For understanding of what is done here, look in to the concept of currying functions
    // https://stackoverflow.com/questions/32782922/what-do-multiple-arrow-functions-mean-in-javascript
    // https://stackoverflow.com/questions/60027202/how-do-i-pass-props-and-other-parameters-to-function-using-react-hooks
    // https://stackoverflow.com/questions/60027202/how-do-i-pass-props-and-other-parameters-to-function-using-react-hooks
    // https://stackoverflow.com/questions/42299594/await-is-a-reserved-word-error-inside-async-function

    handleSubmit = props => async (event) => {

        // No need for prevent default here
        // event.preventDefault();

        this.setState
        ({
            changedfriendrequest: props.value,
        });

        // alert('success');

        const result = await fetch("/handlefriendrequest", 
        {
            method: 'POST',
            headers: 
                {
                    'Content-Type': "application/json; charset=utf-8",
                },
            // This is the data being posted
            body: JSON.stringify(this.state) // + JSON.stringify(this.state.response)
        })

        
        // To be uncommented:

        // const res = await result.json();

        // if(loggedIn)
        // {
        //     this.setState
        //     ({
        //         loggedIn: true
        //     });
        //     window.location.reload();
        // }


    }; 

    renderFriendrequest(item) {

        return (
          <FriendRequest
            value={item}
          />
        );
      }

    async removeRequest(friendreq)
    {





        // const curChatInfo = await this.getChat(newChat);

        // const chatParticipants = curChatInfo.participants;

        // const messageList = curChatInfo.messages;

        // this.setState({curChat: newChat, 
        //             curChatName: chatParticipants, messageList: messageList, 
        //             });

    }

    render() {
        if(this.state.loggedIn == false)
        {
            return <Redirect to='/login' />;
        }


        // if (this.state.curUser == null)
        // {
        //     return (<div> Loading </div>);
        // }

        const friendrequestsList = this.state.friendrequestsList;
        try{
            // reverse() to display the most recently made friend requests first
            var renderedFriendRequests = friendrequestsList.slice(0).reverse().map(friendreq_id => this.renderFriendrequest(friendreq_id))
        }
        catch{
            var renderedFriendRequests = null;
        }
        // Old code
        // var renderedOutput = this.state.friendreqList.map(item => this.renderFriendrequest(item))

        console.log("inside friend requests page");
        return (
            <div className="friendreqPage">
                <div className="friendreqpanel">
                    <div className="searchfriendreq">
                        <div className="inputFieldFriendreq">
                            <form onSubmit={this.handleSubmit}>
                                <input
                                    type="text"
                                    class="friendreqSearchbar-input"
                                    placeholder="Search friend requests..."
                                />
                                <input
                                    type="submit"
                                    class="friendreq-search"
                                    value=""
                                />
                            </form>
                        </div>
                    </div>
                    <div className="friendreqList">


                        {/* <div className="friendrequest">
                            <form onSubmit={this.handleSubmit}>
                                <input
                                    type="submit"
                                    class="acceptButton"
                                    value="Accept"
                                />
                            </form>
                            <form onSubmit={this.handleSubmit}>
                                <input
                                    type="submit"
                                    class="deleteButton"
                                    value="Delete"
                                />
                            </form>
                        </div> */}

                        {renderedFriendRequests}
                    </div>
                </div>
            </div>
            )
        }
    }












