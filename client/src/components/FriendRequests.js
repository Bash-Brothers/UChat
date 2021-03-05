import React, { Component } from "react";
import './style/FriendRequests.css';
import IconSend from '../images/icon_send.svg';
import {Redirect} from "react-router-dom";
import {isLoggedIn} from '../utils.js';



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
            
            // How do we get the current user's username?
            username: "default",
            loggedIn: true.valueOf,
            friendreqList: ["Yan", "Kevin", "Milo", "Sud", "Aman"],
            changedfriendrequest: "",
            response: "none",

            //contactList should be something that is received from the server
            // const friendreqList = 'Yan,Kevin,Milo,Sud,Aman,Eggert,Eggboi,Eggs,SunnySideUp,Omelette,Sud,Aman,Eggert,Eggboi,Eggs,SunnySideUp,Omelette'.split(','),
            
            // More dummy strings
            // , Eggert, Eggboi, Eggs, SunnySideUp, Omelette, Sud, Aman, Eggert, Eggboi, Eggs, SunnySideUp, Omelette
        };
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

        const result = await fetch("/friendrequests", 
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




    componentDidMount() //we need to make sure we are actually logged in
    {                   
        console.log("Inside component did mount for chat window");
        isLoggedIn().then(loggedIn => this.setState({loggedIn: loggedIn}));
    }

    renderFriendrequest(item) {

        return (
          <FriendRequest
            value={item}
          />
        );
      }

    render() {
        if(this.state.loggedIn == false)
        {
            return <Redirect to='/login' />;
        }


        var renderedOutput = this.state.friendreqList.map(item => this.renderFriendrequest(item))
        console.log("inside chatwindow");
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

                        {renderedOutput}
                    </div>
                </div>
            </div>
            )
        }
    }












