import React, { Component } from "react";
import './style/SignupPage.css';
import egg from '../images/paul.jpg';

export default function SignupPage(props) {
        return (
            <div className="signup">
                <img src={egg} id="loginlogo"/>
                <form action="/signup" method="POST" className="signupform" onSubmit="">
                    <p>Username*:</p>
                    <input type="text" name="username" placeholder="" />
                    <p>Email Address*:</p>
                    <input type="text" name="email" placeholder="" />
                    <p>Password*:</p>
                    <input type="password" name="password" placeholder="" />
                    <p>Re-enter Password*:</p>
                    <input type="password" name="" placeholder="" />
                    <p><button>Submit</button></p>
                </form>
                <div id="contact" className="link">Need help with your account or have feedback? <a href ="#">Contact us</a></div>
             </div> 
        )
}




