import React, { Component } from "react";
import './style/About.css'; 	
import logo from '../images/logotest.png';


//just an about page describing our app
export default function About(props) {
        return (
            <div className="about">
                <img src={logo} id="about-logo"/>
                <div className="info-content">
                    Welcome to UChat created by the Bash Brothers! UChat is an application where users can share and send messages like any other app along with LaTeX equations and images!
                    <p>Aman Oberoi</p>
                    <p>Kevin Huang</p>
                    <p>Milo Kearney</p>
                    <p>Sudhanshu Agrawal</p>
                    <p>Yan Hauw &lt;ya2n@protonmail.com&gt;</p>
                </div>

             </div> 
        )
}
