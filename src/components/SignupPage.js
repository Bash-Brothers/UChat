import React, { Component } from "react";
import './style/SignupPage.css';
import egg from '../images/paul.jpg';

export default function SignupPage(props) {
        return (
            <div className="signup">
                <img src={egg} id="loginlogo"/>
                <form className="signupform" onSubmit="">
                    <p>Username*:</p>
                    <input type="text" name="" placeholder="" />
                    <p>Email Address*:</p>
                    <input type="text" name="" placeholder="" />
                    <p>Password*:</p>
                    <input type="password" name="" placeholder="" />
                    <p>Re-enter Password*:</p>
                    <input type="password" name="" placeholder="" />
                    <p><input type="submit" name="" value="Create Account"/></p>
                </form>
                <div id="contact" className="link">Need help with your account or have feedback? <a href ="#">Contact us</a></div>
             </div> 
        )
}




