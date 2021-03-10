import React, { Component } from "react";
import './style/ContactUsPage.css';
import egg from '../images/paul.jpg';

export default function ContactUs(props) {
        return (
            <div className="login">
                <img src={egg} id="loginlogo"/>
                <div className="creators">
                    Creators:
                    <p>Aman Oberoi</p>
                    <p>Kevin Huang</p>
                    <p>Milo Kearney</p>
                    <p>Sudhanshu Agrawal</p>
                    <p>Yan Hauw &lt;ya2n@protonmail.com&gt;</p>
                </div>
             </div> 
        )
}




