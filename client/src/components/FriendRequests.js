import React, { Component } from "react";
import './style/FriendRequests.css';
import IconSend from '../images/icon_send.svg';
import {Redirect} from "react-router-dom";
import {isLoggedIn, getUserInfo} from '../utils.js';



// function FriendRequest(props) {

//     return (
//         <div className="friendrequest">
//             {/* https://stackoverflow.com/questions/42597602/react-onclick-pass-event-with-parameter */}
//             <form onSubmit={() => window.helloComponent.handleSubmit(props)}>
//                 <p class="friendname">{props.value}</p>
//                 <input
//                     type="submit"
//                     class="acceptButton"
//                     value="Accept"
//                     onClick = {() => window.helloComponent.handleClick(props)}
//                 />
//                 <input
//                     type="submit"
//                     class="deleteButton"
//                     value="Delete"
//                     onClick = {() => window.helloComponent.handleClick(props)}
//                 />
//             </form>
//         </div>
//       );
//   }



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
        this.handleClick = this.handleClick.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
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


        // let rows = this.props.rows.map(item => { 
        //     return {uid: SomeLibrary.generateUniqueID(), value: item};
        //   });











        const userInfo = await getUserInfo(); // about current user
        const curUser = userInfo.username;  

        const Notifs  = userInfo.notifs; 
        if(Notifs.length > 0){

            // alert('success');
            // It is only in the render function that we display the most recent friend requests first

            // Probably don't need this
            // const curfriendreq = Notifs[0];  // most recent friend request is displayed by default

            // A friend request carries no information, 
            // the friend request itself is the only information

            // Here we don't have to keep updating list of friend requests
            // We can update friend requests by refreshing the page?

            // get updated list of friend requests every 5 seconds
            // Not sure whether it is right to call this function using .bind(this)
            this.intervalID = setInterval(this.getUpdatedFriendrequestsList.bind(this), 30000)

            this.setState({loggedIn: loggedIn,  curUser: curUser, friendrequestsList: Notifs,  });
        }
        else{
            // Here we don't have to keep updating list of friend requests
            // We can update friend requests by refreshing the page?

            alert('success');
            
            // get updated list of friend requests every 5 seconds
            // Not sure whether it is right to call this function using .bind(this)
            this.intervalID = setInterval(this.getUpdatedFriendrequestsList.bind(this), 30000)

            this.setState({loggedIn: loggedIn,  curUser: curUser, friendrequestsList: null, });
        }
        
    }

    componentWillUnmount()
    {
        // Interval not needed here

        // stop interval once we exit this page
        console.log("Inside will unmount , intervalID = ", this.intervalID);
        clearInterval(this.intervalID);
    }






    handleClick(event, friendreq_id){
        this.setState({response: event.target.value});

        var arraylength = this.state.friendrequestsList.length;
        var array = this.state.friendrequestsList.slice();
        var newarray;

        // alert('success');

        // Instantly removes friend request from UI display
        for (var j = 0; j < arraylength; j++) 
        {
            if (array[j] == friendreq_id)
            {
                
                array.splice(j,1);
                break;
            }
        }

        console.log(array);

        this.setState({friendrequestsList: array});
        // alert('success');




        //do with event
   }


    // For understanding of what is done here, look in to the concept of currying functions
    // https://stackoverflow.com/questions/32782922/what-do-multiple-arrow-functions-mean-in-javascript
    // https://stackoverflow.com/questions/60027202/how-do-i-pass-props-and-other-parameters-to-function-using-react-hooks
    // https://stackoverflow.com/questions/60027202/how-do-i-pass-props-and-other-parameters-to-function-using-react-hooks
    // https://stackoverflow.com/questions/42299594/await-is-a-reserved-word-error-inside-async-function

    handleSubmit(event, friendreq_id)
    {
        // alert('success');

        // No need for prevent default here
        // event.preventDefault();

        // this.setState
        // ({
        //     changedfriendrequest: props.value,
        // });

        // alert('success');

        // const result = await fetch("/handlefriendrequest", 
        // {
        //     method: 'POST',
        //     headers: 
        //         {
        //             'Content-Type': "application/json; charset=utf-8",
        //         },
        //     // This is the data being posted
        //     body: JSON.stringify(this.state) // + JSON.stringify(this.state.response)
        // })

        
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

        var friendrequestsList = this.state.friendrequestsList;
        try{
            // reverse() to display the most recently made friend requests first
            var renderedFriendRequests = friendrequestsList.slice(0).reverse().map(friendreq_id => 

                // Note: I spent a hell of a long time searching this up,
                // In a complex react component that contains many elements,
                // and there is a changing array involved
                // ALL the children and elements each have to have a key
                // https://stackoverflow.com/questions/28329382/understanding-unique-keys-for-array-children-in-react-js

                <div className="friendrequest" key={friendreq_id}>
                    {/* https://stackoverflow.com/questions/42597602/react-onclick-pass-event-with-parameter */}
                    <form key={friendreq_id}>
                        {/* onSubmit={(e) => {this.handleSubmit(e, friendreq_id)}} */}
                        <p class="friendname" key={friendreq_id}>{friendreq_id}</p>
                        <input
                            type="submit"
                            class="acceptButton"
                            value="Accept"
                            onClick = {(e) => {this.handleClick(e, friendreq_id)}}
                            key={friendreq_id}
                        />
                        <input
                            type="submit"
                            class="deleteButton"
                            value="Delete"
                            onClick = {(e) => {this.handleClick(e, friendreq_id)}}
                            key={friendreq_id}
                        />
                    </form>
                </div>

                // this.renderFriendrequest(friendreq_id)
                )
        }
        catch{
            // alert('success');
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
                            <form>
                                {/* onSubmit={this.handleSubmit} */}
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












