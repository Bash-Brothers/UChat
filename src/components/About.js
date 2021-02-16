import React, { Component } from "react";
import './style/About.css';
import egg from '../images/paul.jpg';

export default function About(props) {
        return (
            <div className="login">
                <img src={egg} id="loginlogo"/>
                <div className="intro">
                    Welcome to chatapp created by the Bash Brothers!
                </div>
             </div> 
        )
}
