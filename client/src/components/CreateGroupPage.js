import React, { Component } from "react";
import './style/CreateGroupPage.css';
import {Redirect} from "react-router-dom";
import {isLoggedIn, getUserInfo} from '../utils.js';

export default class CreateGroupPage extends Component {

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
            friendsToAdd: [],
            maximumSize: false, // whether maximum number of people we can add to a group(3) has been reached
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
    };


    // This function is incomplete
    handleCreate = async (event) => 
    {
        if(this.state.friendsToAdd.length != 2)
        {
            document.getElementById('alert-red').innerHTML='Group size must be greater than 2!'
            document.getElementById('alert-red').style.width="20vw"
            document.getElementById('alert-red').style.visibility='visible';
            setTimeout(function() {
                document.getElementById('alert-red').style.visibility='hidden';
            }, 3000); // <-- time in milliseconds

        }
        else
        {
            let selectedfriends = this.state.friendsToAdd;

            // This was the fetch API I failed to get working
            //======================================================================
            const result = await fetch("/makegroups" , 
                    {
                        method: 'POST',
                        headers: {
                        'Content-Type': "application/json; charset=utf-8",
                    },
                    body: JSON.stringify({
                        username: this.state.curUser, 
                        friendname1: selectedfriends[0], 
                        friendname2: selectedfriends[1]
                    })
                    /* this is the data being posted */
            });
            //======================================================================

            const res = await result.json();  /* this is the res sent by the backend of find users etc */

            if (res == 0)
            {
                document.getElementById('alert-green').innerHTML='Group chat created!'
                document.getElementById('alert-green').style.width="10vw"
                document.getElementById('alert-green').style.visibility='visible';
                setTimeout(function() {
                    document.getElementById('alert-green').style.visibility='hidden';
                }, 3000); // <-- time in milliseconds
            }
            else if (res == 1)
            {
                document.getElementById('alert-red').innerHTML='Group chat already exists!'
                document.getElementById('alert-red').style.width="10vw"
                document.getElementById('alert-red').style.visibility='visible';
                setTimeout(function() {
                    document.getElementById('alert-red').style.visibility='hidden';
                }, 3000); // <-- time in milliseconds
            }
            else
            {
                document.getElementById('alert-red').innerHTML='Something failed.'
                document.getElementById('alert-red').style.width="10vw"
                document.getElementById('alert-red').style.visibility='visible';
                setTimeout(function() {
                    document.getElementById('alert-red').style.visibility='hidden';
                }, 3000); // <-- time in milliseconds
            }
        }

        // Reset list of friends to be added to empty
        this.resetSelectedList()

    }

    resetSelectedList = async() =>
    {
        const newSelectedList = [];
        this.setState({friendsToAdd: newSelectedList, });
    }



    // for add friend button
    handleClick = async (user) => {
        
        
        let newToBeAdded = this.state.friendsToAdd.slice();

        newToBeAdded.push(user);

        newToBeAdded.sort();

        this.setState({friendsToAdd: newToBeAdded});
        

    }


    render() {
        if(this.state.loggedIn == false)
        {
            return <Redirect to='/login' />;
        }

        //receive the contact list from the backend
        //curUserList is an array of objects where each object represents
        //a user whose username matches our search substring
        var contactList = this.state.curUserList

        // Filter search results to find only users who are friends
        var friendsList = contactList.filter(contactcard => contactcard['addstatus'] === 2)

        var toAdd = this.state.friendsToAdd; // Creating a collection of names that will be added to the created group
        // Array of simply usernames only
        
        var indexesToRemove = []; 
        // This array helps us know which users are already in the collection of names
        // So that we can make the search bar no longer display them as a result in subsequent searches


        // Code that allows us to know which friend's names we no longer should
        // display
        //======================================================================
        for(var i in toAdd)
        {
            for(var j in friendsList)
            {
                let username = (friendsList[j])['user'];
                if(toAdd[i] == username)
                {
                    indexesToRemove.push(j);
                    break;
                }
            }
        }
        //======================================================================

        // Code that removes the already selected names from subsequent searches
        //======================================================================
        let sortedIndexes = indexesToRemove.sort();
        let reversedIndexes = sortedIndexes.reverse();

        for (let k in reversedIndexes)
        {
            friendsList.splice(reversedIndexes[k], 1);
        }
        //======================================================================

        let friends;
        if(toAdd.length == 0)
        {
            friends = null;
        }
        else
        {
            // List of friends to be added to group chat
            // Displayed on the right in front end
            friends = toAdd.map(toAdd =>
                <div className="friend-for-group-background">
                    <div className="friend-for-group">
                        {toAdd}
                    </div>
                </div> 
            )
        }

        var renderedcontacts;
        var finalrender;
        // if there the searched subtring returns no matches
        if((friendsList === undefined || friendsList.length == 0) && this.state.hasSearched){
            renderedcontacts = <div className="noresults">No users matching the search</div>;
            finalrender = <div className="searchresult">{renderedcontacts}</div>
        }
        else if(this.state.friendsToAdd.length == 2) 
        {
            // I designed it such that we would keep group size to 3 for now
            renderedcontacts = <div className="noresults">The maximum group size is 3</div>;
            finalrender = <div className="searchresult">{renderedcontacts}</div>
        }
        else{
            // generate the contact cards to be rendered
            // addstatus is an object property that is first set in the backend in server.js
            renderedcontacts = friendsList.map(contactcard =>
                <div className="add-for-group-background" key={contactcard['user'] + '.1'}> 
                    <div className="add-for-group" key={contactcard['user'] + '.2'}> 
                        {contactcard['user']}
                    </div>
                    <div 
                        className="button-add-to-group" 
                        onClick={() => this.handleClick(contactcard['user'])}
                        key={contactcard['user'] + '.3'}
                    >
                    </div>
                </div> 
            );
            if(renderedcontacts === null || renderedcontacts.length == 0)
            {
                finalrender = renderedcontacts;
            }
            else
            {
                // finalrender = <div>{renderedcontacts}</div>
                finalrender = <div className="searchresult">{renderedcontacts}</div>
            }
        }



        return (
            <div>
            <div className="searchpage">
                <div className="buttons">
                    <form action="/search" onSubmit={this.handleSubmit}>
                        <input 
                            type="search"
                            name="query"
                            className="search-friends-input"
                            value= {this.state.search_value}
                            onChange= {this.handleChange}
                            placeholder="Pick friends to create a group"
                        />
                        <input className="search-friends-button" type="submit" value="" />

                    </form>
                    <div 
                        className="createButton" 
                        onClick = {this.handleCreate}
                    >
                        Create Group
                    </div>
                </div>
                <div className="results">
                    {finalrender}
                    <div className="collectionToAdd">{friends}</div>
                </div>
            </div> 
            </div>
        )
    }
}
