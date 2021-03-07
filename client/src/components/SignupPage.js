import React, { Component } from "react";
import {Redirect} from "react-router-dom";
import './style/SignupPage.css';
import egg from '../images/paul.jpg';

export default class SignupPage extends React.Component
{      
    constructor(props)
    {
        super(props);
        this.state = {name: "default", username: "default", password: "default", password_confirm: "defaultc", isSignedUp: false };
    }

    handleChange = (event) => {
        this.setState({[event.target.name]: event.target.value});
    }


    handleSubmit =  async (event) => {
        event.preventDefault();
        const result = await fetch("/signup", 
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
        console.log("success code from handle  : ",res.successCode );
        event.target.reset(); // clear out form entries
        this.setState({isSignedUp: !res.successCode});
        };

    render()
    {
        if (this.state.isSignedUp)
        {
            return <Redirect to="/login" />;
        }
        return (
            <div className="signup">
                <img src={egg} id="loginlogo"/>
                <form action="/signup" className="signupform" onSubmit={this.handleSubmit}>
                    <input type="text" className="signupField" placeholder="Name" name="name" />
                    <input type="text" className="signupField" placeholder="Username" name="username" value = {this.state.value} onChange = {this.handleChange} />
                    <input type="password" className="signupField" placeholder="Password" name="password" value = {this.state.value} onChange = {this.handleChange}/>
                    <input type="password" className="signupField" placeholder="Re-enter password" name="password_confirm" value = {this.state.value} onChange = {this.handleChange}/>
                    <input type="submit" className="signupButton" value="Sign Up" />
                </form>
                <div id="contact" className="link">Need help with your account or have feedback? <a href ="#">Contact us</a></div>
             </div> 
        );
    }
}




