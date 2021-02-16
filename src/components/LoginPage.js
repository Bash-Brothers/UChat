import React, { Component } from "react";
import './style/LoginPage.css';
import egg from '../images/paul.jpg';

export default function LoginPage(props) {
        return (
            <div className="login">
                <img src={egg} id="loginlogo"/>
                <form className="loginform" onSubmit="">
                    <p>Username:</p>
                    <input type="text" name="" placeholder="" />
                    <p>Password:</p>
                    <input type="password" name="" placeholder="" />
                    <p><input type="submit" name="" value="Login"/></p>
                    <div className="link"><a href ="#">Forgot username/password?</a></div>
                    <div className="link"><a href="#">Don't have an account? Click here to sign up.</a></div>
                </form>
             </div> 
        )
}
