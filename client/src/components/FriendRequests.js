import React, { Component } from "react";
import './style/FriendRequests.css';
import {Redirect} from "react-router-dom";
import {isLoggedIn, getUserInfo} from '../utils.js';


export default class FriendRequests extends Component {

    constructor(props)
    {
        super(props);
        this.state = {

            loggedIn: true,
            curUser: null, // stores the username of the person logged in
            friendrequestsList: null, // current list of friend requests
            curfriendreq: null, //stores the friendrequestId of current friend request
            intervalID: null, // sets update interval
            response: false, // will later be updated to accept or delete

        };
        this.handleAccept = this.handleAccept.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
    }


    async getUpdatedFriendrequestsList() 
    {
        console.log("Getting updated friend requests list");
        try{
            const userInfo = await getUserInfo();
            const Notifs  = userInfo.notifs; 
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

            // get updated list of friend requests every 5 seconds
            this.intervalID = setInterval(this.getUpdatedFriendrequestsList.bind(this), 5000)

            this.setState({loggedIn: loggedIn,  curUser: curUser, friendrequestsList: Notifs,  });

            console.log("Obtained user info and friend requests array");
        }
        else{
            
            // get updated list of friend requests every 5 seconds
            // Not sure whether it is right to call this function using .bind(this)
            this.intervalID = setInterval(this.getUpdatedFriendrequestsList.bind(this), 5000)

            this.setState({loggedIn: loggedIn,  curUser: curUser, friendrequestsList: null, });
        }
        
        console.log("Completed component did mount for friend requests page");
    }

    componentWillUnmount()
    {
        // Interval not needed here

        // stop interval once we exit this page
        console.log("Inside will unmount , intervalID = ", this.intervalID);
        clearInterval(this.intervalID);
    }

    handleAccept = async (friendreq_id) =>
    {
      
        const id = friendreq_id;

        // Fetching from server.js
        const result = await fetch("/handlefriendrequest", 
        {
            method: 'POST',
            headers: 
                {
                    'Content-Type': "application/json; charset=utf-8",
                },
            // This is the data being posted
            body: JSON.stringify({curUser: this.state.curUser, curfriendreq:id, response:true}) // + JSON.stringify(this.state.response)
        })

        const res = await result.json();

        const returnCode = await res.successCode;
        
        if (returnCode != 0)
        {
           alert('error sending chat')
            return null;
        }

        //Process the friend request
        this.updateandFetch(friendreq_id);

   }


   handleDelete = async (friendreq_id) =>
   {
    const id = friendreq_id;

    // Fetching from server.js
    const result = await fetch("/handlefriendrequest", 
    {
        method: 'POST',
        headers: 
            {
                'Content-Type': "application/json; charset=utf-8",
            },
        // This is the data being posted
        body: JSON.stringify({curUser: this.state.curUser, curfriendreq:id, response:false}) // + JSON.stringify(this.state.response)
    })

    const res = await result.json();

    const returnCode = await res.successCode;
    
    if (returnCode != 0)
    {
       console.log('return code was not 0 from server.js')
    }

        //Process the friend request
        this.updateandFetch(friendreq_id);

    }


   updateandFetch = async (friendreq_id) =>
   {

        // Removing friend request from UI display
        var arraylength = this.state.friendrequestsList.length;
        var array = this.state.friendrequestsList.slice();

        // Carry on from above: instantly removes friend request from UI display
        for (var j = 0; j < arraylength; j++) 
        {
            if (array[j] == friendreq_id)
            {
                
                array.splice(j,1);
                break;
            }
        }

        this.setState({friendrequestsList: array, });


   }


    render() {
        if(this.state.loggedIn == false)
        {
            return <Redirect to='/login' />;
        }
        if (this.state.curUser == null)
        {
            return (<div> Loading </div>);
        }

        console.log("Friend requests render");

        var friendrequestsList = this.state.friendrequestsList;
        var renderedFriendRequests;
        
        if(friendrequestsList === null || friendrequestsList.length == 0)
        {
            renderedFriendRequests = <div className="friendrequest"> <a id="no-requests" href='search'>You don't have any friend requests! Search for users here</a></div>
        }
        else
        {
            // reverse() to display the most recently made friend requests first
            renderedFriendRequests = friendrequestsList.slice(0).reverse().map(friendreq_id => 

                <div className="friendrequest" key={friendreq_id + '.div'}>
                    <p className="friendname" key={friendreq_id + '.p'}>
                        {friendreq_id}
                    </p>
                    <div className="buttonRow">
                    <div 
                        className="acceptButton" 
                        key={friendreq_id + '.acc'}
                        onClick = {() => {this.handleAccept(friendreq_id)}}
                    >
                        Accept
                    </div>
                    <div 
                        className="deleteButton" 
                        key={friendreq_id + '.del'}
                        onClick = {() => {this.handleDelete(friendreq_id)}}
                    >
                        Delete
                    </div>
                    </div>


                </div>

                )
        }

        console.log("Generating friend requests page");
        return (
            <div className="friendreqPage">
                <div className="friendreqpanel">
                    <div className="friendreqList">
                        {renderedFriendRequests}
                    </div>
                </div>
            </div>
            )
            
        }
        
    }












