import React, { Component } from "react";
import './style/Test.css';
import egg from '../images/paul.jpg';

export default function Test(props) {
        return (
            <div className="login">
                <img src={egg} id="loginlogo"/>
                <div className="intro">
                    Test page unlocked!
                </div>
             </div> 
        )
}
