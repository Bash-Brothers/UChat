import React, { Component } from "react";
import './style/SearchPage.css';
import egg from '../images/paul.jpg';
import {Redirect} from "react-router-dom";
import {isLoggedIn, getUserInfo} from '../utils.js';

export default class SearchPage extends Component {

    constructor(props)
    {
        super(props);
        this.state = {
            loggedIn: true, 
            search: "", 
            curUser: "default",
            successCode: 1, // successCode = 0 means search was successful, 1 means no search yet, -1 means search unsuccesful
            curUserList: [],
            hasSearched: false, //has the user searched yet
        };
    }
    async componentDidMount() //we need to make sure we are actually logged in
    {                   
        console.log("Inside component did mount for chat window");
        const userInfo = await getUserInfo(); // about current user
        const curUser = userInfo.username;  
        isLoggedIn().then(loggedIn => this.setState({loggedIn: loggedIn}));
        this.setState({curUser:curUser});
    }

    handleChange = (event) => {
        console.log("Inside handleChange")
        const searchWord = event.target.value
        console.log("Inside handleChange of search page, searched keyword is: ", searchWord)
        this.setState({search: searchWord})
        //this.setState({[event.target.name]: event.target.value});
    }

    handleSubmit =  async (event) => {
        event.preventDefault();
        const result = await fetch("/findusers/" + this.state.search, 
                  {
                    method: 'GET',
                    headers: {
                      'Content-Type': "application/json; charset=utf-8",
                  },
                  /* this is the data being posted */
        });

        const res = await result.json();  /* this is the res sent by the backend of find users etc */

        const successCode = await res.successCode;
        const users = await res.users;

        event.target.reset(); // clear out form entries
        this.setState({successCode: successCode, curUserList: users, hasSearched: true})
        // make the contactList object 
    };

    // for add friend button
    handleClick = async (user) => {
        const result = await fetch("/sendfriendrequest", 
                  {
                    method: 'POST',
                    headers: {
                      'Content-Type': "application/json; charset=utf-8",
                  },
                  body: JSON.stringify({username: this.state.curUser, friendname: user})
                  /* this is the data being posted */
        });

        const res = await result.json();  /* this is the res sent by the backend of find users etc */
        document.getElementById('alert-green').innerHTML='Friend Request Sent'
        document.getElementById('alert-green').style.width="10vw"
        document.getElementById('alert-green').style.visibility='visible';
        setTimeout(function() {
            document.getElementById('alert-green').style.visibility='hidden';
        }, 3000); // <-- time in milliseconds
        
        var list = this.state.curUserList;
        for(var i in list){
            if((list[i])['user'] == user)
            {
                (list[i])['addstatus'] = 1;
                break;
            }
        }
        this.setState({curUserList: list});

        //function showDiv(){
        //    document.getElementById('request-sent').style.visibility="visible";
        //}
    
        //function hideDiv(){
        //    document.getElementById('request-sent').style.visibility="hidden";
        //}

        //setTimeout("showDiv()", 1000);
        //setTimeout("hideDiv()", 5000);

        //const successCode = await res.successCode;
        //const users = await res.users;

        //event.target.reset(); // clear out form entries
        //this.setState({successCode: successCode, curUserList: users, hasSearched: true})

        // call sendFriendRequest(curUser, Paul)
        //change addstatus, send update to backend (call add friend)

    }

    button(status, user) {
        switch (status) {
            case 0:
                return(<div className="button-add" onClick={() => this.handleClick(user)}/>)
            case 1: 
                return(<div className="button-pending"/>)
            case 2:
                return(<div className="button-friend"/>)
        }
    }

    render() {
        if(this.state.loggedIn == false)
        {
            return <Redirect to='/login' />;
        }

        //receive this from the backend
        var contactList = this.state.curUserList
        var index = -1;
        for(var i in contactList)
        {
            if((contactList[i])['user'] === this.state.curUser)
            {
                index = i;
                break;
            }
        }
        
        if(index > -1)
        {
            contactList.splice(index, 1);
        }

        var renderedcards;
        if((contactList === undefined || contactList.length == 0) && this.state.hasSearched){
            renderedcards = <div className="noresults">No users matching the search</div>
        }
        else{
        var renderedcards = contactList.map(contactcard => (contactcard['addstatus'] === 2) ?

            <div className="contactcard-friend">
                <div className="contactname-friend">
                    {contactcard['user']}
                </div>
                {this.button(contactcard['addstatus'], contactcard['user'])}
            </div> :
            <div className="contactcard">
                <div className="contactname">
                    {contactcard['user']}
                </div>
                {this.button(contactcard['addstatus'], contactcard['user'])}
            </div>
            )
        }
        return (
            <div>
            <div className="searchpage">

                <form action="/search" onSubmit={this.handleSubmit}>
                    <input 
                        type="search"
                        name="query"
                        className="search-input"
                        value= {this.state.search_value}
                        onChange= {this.handleChange}
                        placeholder="Search for Friends"
                    />
                    <input className="search-button" type="submit" value="" />

                </form>
                {renderedcards}
            </div> 
            </div>
        )
    }
}
