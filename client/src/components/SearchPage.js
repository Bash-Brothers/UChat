import React, { Component } from "react";
import './style/SearchPage.css';
import egg from '../images/paul.jpg';
import {Redirect} from "react-router-dom";
import {isLoggedIn} from '../utils.js';

export default class SearchPage extends Component {

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
    render() {
        if(this.state.loggedIn == false)
        {
            return <Redirect to='/login' />;
        }


        return (
            <div className="searchpage">
<<<<<<< Updated upstream
                <form>
                    <div class="search-bar">
                        <input 
                            type="search"
                            class="search-input"
                            placeholder="Search ChatApp"
                        />
                    </div>  
                    <div class="search-button">
                        <input 
                            type="submit" 
                            value="Search"
                            class="search-send" 
                        />
                    </div>  
=======
                <form action="/search" onSubmit={this.handleSubmit}>
                    <input 
                        type="search"
                        name="query"
                        className="search-input"
                        value= {this.state.value}
                        onChange= {this.handleChange}
                        placeholder="Search for Friends"
                    />
>>>>>>> Stashed changes
                </form>
                
                {/* <div className="search">
                    <form>
                        <input 
                            type="search"
                            class="message-input"
                            placeholder="Search ChatApp"
                        />
                        <input 
                            type="submit" 
                            value="Send"
                            class="message-send" 
                        />
                    </form>
                </div> */}
            </div> 
        )
    }
}
