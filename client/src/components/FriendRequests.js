import React, { Component } from "react";
import './style/FriendRequests.css';
import IconSend from '../images/icon_send.svg';
import {Redirect} from "react-router-dom";
import {isLoggedIn} from '../utils.js';



function Friendrequest(props) {
    return (
        <div className="friendrequest">
            <form>
                <p class="friendname">{props.value}</p>
                <input
                    type="submit"
                    class="acceptButton"
                    value="Accept"
                />
                <input
                    type="submit"
                    class="deleteButton"
                    value="Delete"
                />
            </form>
        </div>
      );
  }



export default class FriendRequests extends Component {

    constructor(props)
    {
        super(props);
        this.state = {loggedIn: true};
    }
    componentDidMount() //we need to make sure we are actually logged in
    {                   
        console.log("Inside component did mount for chat window");
        isLoggedIn().then(loggedIn => this.setState({loggedIn: loggedIn}));
    }

    renderFriendrequest(item) {
        return (
          <Friendrequest
            value={item}
          />
        );
      }

    render() {
        if(this.state.loggedIn == false)
        {
            return <Redirect to='/login' />;
        }
        //contactList should be something that is received from the server
        const contactList = 'Yan,Kevin,Milo,Sud,Aman,Eggert,Eggboi,Eggs,SunnySideUp,Omelette,Sud,Aman,Eggert,Eggboi,Eggs,SunnySideUp,Omelette'.split(',');

        var renderedOutput = contactList.map(item => this.renderFriendrequest(item))
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















