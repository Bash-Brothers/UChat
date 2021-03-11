import React, { Component } from "react";
import {Redirect} from "react-router-dom";
import './style/LoginPage.css';
import logo from '../images/logotest.png';
import { isLoggedIn } from '../utils.js';

function DisplayErrors(props) {
    const success = props.success;
    switch (success) {
        case 1: //wrong password
            return (<div className="loginError">Incorrect password</div>)
        case 2: //invalid username
            return (<div className="loginError">Invalid username</div>)
        default: 
            return (null);
    }
}

export default class LoginPage extends React.Component
{
    constructor(props)
    {
        super(props);
        this.state = {
            username: "", 
            password: "", 
            loggedIn: false, 
            successCode: 0,
        };
    }
    async componentDidMount() 
    {                   
		console.log("Inside component did mount for login page");
        const loggedIn = await isLoggedIn();
        if (loggedIn)
        {
            this.setState({loggedIn: true});
        }
    }

    handleChange = (event) => {
        console.log("Setting state to ",{[event.target.name]: event.target.value} )
        this.setState({[event.target.name]: event.target.value});
    }

    handleSubmit =  async (event) => {
        event.preventDefault();
        console.log("login state = ", this.state)
        const result = await fetch("/login", 
                  {
                    method: 'POST',
                    headers: {
                      'Content-Type': "application/json; charset=utf-8",
                  },
                  body: JSON.stringify(this.state) /* this is the data being posted */
        })
        const res = await result.json();  /* this is the res sent by the backend */

        const loggedIn = res.successCode == 0; 

        if(loggedIn)
        {
            event.target.reset(); // clear out form entries
            this.setState({loggedIn: true, username: "", password: "",});
            window.location.reload();  // necessary for nav bar to reload
        }
        else 
        {
            event.target.reset(); // clear out form entries
            this.setState({loggedIn: false, successCode: res.successCode, username: "", password: "",});  
        }


        };

    render()
    {
        console.log("rendering login");
        if(this.state.loggedIn)
        {
            return <Redirect to='/chats' />;
        }

        return (
            <div className="login">
            <img src={logo} id="login-logo"/>
            <form action="/login" className="loginform" onSubmit={this.handleSubmit}>
                <input type="text" className="loginField" placeholder="Username" name="username" value = {this.state.username} onChange = {this.handleChange} />
                <input type="password" className="loginField" placeholder="Password" name="password" value = {this.state.password} onChange = {this.handleChange}/>
                <DisplayErrors success={this.state.successCode} />
                <input type="submit" className="loginButton" value="Log In"/>
                {/* <a href ="/" class="loginlink">Forgot username/password?</a> */}
                <a href="/signup" id="loginlink">Don't have an account? Click here to sign up.</a>
            </form>
            <div id="contact" className="contactlink">Need help with your account or have feedback? <a href ="/about">Contact us</a></div>
            </div> 
          );
        
    }
}
