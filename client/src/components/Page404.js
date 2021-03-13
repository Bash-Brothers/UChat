import React, { Component } from "react";
import './style/Page404.css';
import egg from '../images/paul.jpg';


//page404 in case someone tries to access an invalid URL
export default function Page404(props) {
        return (
            <div className="login">
                <img src={egg} id="loginlogo"/>
                <div className="intro">
                    Uh oh, this page doesn't exist
                </div>
             </div> 
        )
}
