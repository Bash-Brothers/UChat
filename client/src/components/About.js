import React, { Component } from "react";
import './style/About.css'; 	
import egg from '../images/paul.jpg';

export default function About(props) {
        return (
            <div className="about">
                <img src={egg} id="loginlogo"/>
                <div className="info-content">
                    Welcome to chatapp created by the Bash Brothers!
                    <p>Aman Oberoi</p>
                    <p>Kevin Huang</p>
                    <p>Milo Kearney</p>
                    <p>Sudhanshu Agrawal</p>
                    <p>Yan Hauw &lt;ya2n@protonmail.com&gt;</p>
                </div>

             </div> 
        )
}
