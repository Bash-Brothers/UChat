import React, { Component } from "react";
import {Redirect} from "react-router-dom";
import './style/LoginPage.css';
import egg from '../images/paul.jpg';
import { isLoggedIn } from '../utils.js';

export default class LoginPage extends React.Component
{
    constructor(props)
    {
        super(props);
        this.state = {username: "default", password: "default", loggedIn: false};
    }

    handleChange = (event) => {
        this.setState({[event.target.name]: event.target.value});
    }

    handleSubmit =  async (event) => {
        event.preventDefault();
        const result = await fetch("/login", 
                  {
                    method: 'POST',
                    headers: {
                      'Content-Type': "application/json; charset=utf-8",
                  },
                  body: JSON.stringify(this.state) /* this is the data being posted */
        })

        const res = await result.json();  /* this is the res sent by the backend */

        // currently, I return a successCode depending on what happened in the backend
        // when successCode = 0, the user is logged in so we change state.isLoggedIn
        // the successCode also has other states such as for "user not found", "incorrect pwd"
        // so we can either getElementById or something similar to change the display according to that

        event.target.reset(); // clear out form entries

        const loggedIn = await isLoggedIn();   // uses the actual function isLoggedIn not the success code 
                                               // can be modified, it's a test
        
        // this is written out like this because we will eventually 
        // need to set state conditionally depending on the successCode
        if(loggedIn)
        {
            this.setState({loggedIn: true});
            window.location.reload();
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
            <img src={egg} id="loginlogo"/>
            <form action="/login" className="loginform" onSubmit={this.handleSubmit}>
                <p>Username:</p>
                <input type="text" name="username" value = {this.state.value} onChange = {this.handleChange} />
                <p>Password:</p>
                <input type="password" name="password" value = {this.state.value} onChange = {this.handleChange}/>
                <p />
                <input type="submit" value="Login" />
                <a href ="/" class="loginlink">Forgot username/password?</a>
                <a href="/signup" class="loginlink">Don't have an account? Click here to sign up.</a>
            </form>
            <div id="contact" className="contactlink">Need help with your account or have feedback? <a href ="#">Contact us</a></div>
            </div> 
          );
        
    }
}
