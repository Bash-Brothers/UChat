import React, { Component } from "react";
import './style/LoginPage.css';
import egg from '../images/paul.jpg';

export default class LoginPage extends React.Component
{
    constructor(props)
    {
        super(props);
        this.state = {username: "default", password: "default"};
    }

    handleChange = (event) => {
        this.setState({[event.target.name]: event.target.value});
    }


    // handleSubmit =  async (event) => {
    //     event.preventDefault();
    //     const response = await fetch("/login", 
    //               {
    //                 method: 'POST',
    //                 headers: {
    //                   'Content-Type': "application/json; charset=utf-8",
    //               },
    //               body: JSON.stringify(this.state) /* this is the data being posted */
    //     });

    //     };

    render()
    {
        return (
            <div className="login">
            <img src={egg} id="loginlogo"/>
            <form action="/login" method="POST" className="loginform">
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
