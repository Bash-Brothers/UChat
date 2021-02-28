import React, { Component } from "react";
import {Redirect} from "react-router-dom";
import './style/LoginPage.css';
import egg from '../images/paul.jpg';

export default class LoginPage extends React.Component
{
    constructor(props)
    {
        super(props);
        this.state = {username: "default", password: "default", isLoggedIn: false};
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
        this.setState({isLoggedIn: !res.successCode});
        };

    render()
    {
        console.log("isLoggedIn =========== ", this.state.isLoggedIn);
        if(this.state.isLoggedIn)
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
                <input type="submit" value="Login" />
                <div className="link"><a href ="/">Forgot username/password?</a></div>
                <div className="link"><a href="/signup">Don't have an account? Click here to sign up.</a></div>
            </form>
            <div id="contact" className="link">Need help with your account or have feedback? <a href ="#">Contact us</a></div>
            </div> 
          );
        
    }
}
