import React from "react";
import {Redirect} from "react-router-dom";
import './style/SignupPage.css';
import logo from '../images/logotest.png';
import { isLoggedIn } from '../utils.js';

function DisplayErrors(props) {
    const success = props.success;
    switch (success) {
        case 1: //username already taken
            return (<div className="signupError">Username is already taken</div>)
        case 2: //empty password/username
            return (<div className="signupError">Username and password must be non-empty</div>)
        case 3: //passwords do not match
            return (<div className="signupError">Passwords do not match</div>)
        default: 
            return (null);
    }
}

export default class SignupPage extends React.Component
{      
    constructor(props)
    {
        super(props);
        this.state = {
            name: "", 
            username: "", 
            password: "", 
            password_confirm: "", 
            isSignedUp: false,
            loggedIn: false,
            successCode: 0, 
        };
    }

    async componentDidMount() 
    {                   
        const loggedIn = await isLoggedIn();
        if (loggedIn)
        {
            this.setState({loggedIn: true});
            window.location.reload();
        }
    }

    handleChange = (event) => {
        this.setState({[event.target.name]: event.target.value});
    }


    handleSubmit =  async (event) => {
        event.preventDefault();
        const result = await fetch("/signup", 
                  {
                    method: 'POST',
                    headers: {
                        'Content-Type': "application/json; charset=utf-8",
                  },
                  body: JSON.stringify(this.state) /* this is the data being posted */
        })

        const res = await result.json();  /* this is the res sent by the backend */

        var alertDiv = (!res.successCode) ? 'alert-green' : 'alert-red';
        var alertMessage = (!res.successCode) ? 'Registration successful!' : 'Registration unsuccessful!';

        //create an alert based on if registartion is successful or not
        document.getElementById(alertDiv).innerHTML=alertMessage;
        document.getElementById(alertDiv).style.width="10vw";
        document.getElementById(alertDiv).style.visibility='visible';
        setTimeout(function() {
            document.getElementById(alertDiv).style.visibility='hidden';
        }, 3000); // <-- time in milliseconds

        event.target.reset(); // clear out form entries
        this.setState({isSignedUp: !res.successCode, successCode: res.successCode, name: "", 
            username: "", 
            password: "", 
            password_confirm: "", });
        };

    render()
    {
        if (this.state.isSignedUp) //once signup is complete
        {
            return <Redirect to="/login" />;
        }
        if (this.state.loggedIn) //if you're already logged in
        {
            return <Redirect to="/chats" />
        }
        return (
            <div className="signup">
                <img src={logo} id="signup-logo"/>
                <form action="/signup" className="signupform" onSubmit={this.handleSubmit}>
                    <input type="text" className="signupField" placeholder="Name" name="name" value = {this.state.value} onChange = {this.handleChange}/>
                    <input type="text" className="signupField" placeholder="Username" name="username" value = {this.state.value} onChange = {this.handleChange} />
                    <input type="password" className="signupField" placeholder="Password" name="password" value = {this.state.value} onChange = {this.handleChange}/>
                    <input type="password" className="signupField" placeholder="Re-enter password" name="password_confirm" value = {this.state.value} onChange = {this.handleChange}/>
                    <DisplayErrors success={this.state.successCode} />
                    <input type="submit" className="signupButton" value="Sign Up" />
                    <a href="/login" id="loginlink">Already have an account? Click here to sign in.</a>
                </form>
                <div id="contact" className="contactlink">Need help with your account or have feedback? <a href ="/about">Contact us</a></div>
             </div> 
        );
    }
}




