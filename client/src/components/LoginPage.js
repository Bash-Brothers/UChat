import React, { Component } from "react";
import './style/LoginPage.css';
import egg from '../images/paul.jpg';

export default function LoginPage(props) {
        return (
            <div className="login">
                <img src={egg} id="loginlogo"/>
                <form action="/login" method="POST" className="loginform" onSubmit="">
                    <p>Username:</p>
                    <input type="text" name="username" placeholder="" />
                    <p>Password:</p>
                    <input type="password" name="password" placeholder="" />
                    <p><button>login</button></p>
                    <div className="link"><a href ="/">Forgot username/password?</a></div>
                    <div className="link"><a href="/signup">Don't have an account? Click here to sign up.</a></div>
                </form>
                <div id="contact" className="link">Need help with your account or have feedback? <a href ="#">Contact us</a></div>
             </div> 
        )
}
