import React, { Component } from "react";
import {Redirect} from "react-router-dom";
import './style/LoginPage.css';
import egg from '../images/paul.jpg';
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
            username: "default", 
            password: "default", 
            loggedIn: false, 
            successCode: 0};
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

        // alert('success');

        // currently, I return a successCode depending on what happened in the backend
        // when successCode = 0, the user is logged in so we change state.isLoggedIn
        // the successCode also has other states such as for "user not found", "incorrect pwd"
        // so we can either getElementById or something similar to change the display according to that

        event.target.reset(); // clear out form entries

        const loggedIn = await isLoggedIn();   // uses the actual function isLoggedIn not the success code 
                                               // can be modified, it's a test
        this.setState({successCode: res.successCode})
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
                <input type="text" className="loginField" placeholder="Username" name="username" value = {this.state.value} onChange = {this.handleChange} />
                <input type="password" className="loginField" placeholder="Password" name="password" value = {this.state.value} onChange = {this.handleChange}/>
                <DisplayErrors success={this.state.successCode} />
                <input type="submit" className="loginButton" value="Log In"/>
                <a href ="/" class="loginlink">Forgot username/password?</a>
                <a href="/signup" class="loginlink">Don't have an account? Click here to sign up.</a>
            </form>
            <div id="contact" className="contactlink">Need help with your account or have feedback? <a href ="#">Contact us</a></div>
            </div> 
          );
        
    }
}
