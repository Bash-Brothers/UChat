import React, { Component } from "react";
import { Link, Redirect } from 'react-router-dom';
import './style/Settings.css';
import {isLoggedIn} from '../utils.js';

export default class Settings extends Component {
	constructor(props) {
		super(props);
		this.state = {
			loggedIn: true,
		}
	}

	componentDidMount() //we need to make sure we are actually logged in
    {                   
        console.log("Inside component did mount for settings page");
        isLoggedIn().then(loggedIn => this.setState({loggedIn: loggedIn}));
    }

	handleChange = (event) => {
        this.setState({[event.target.name]: event.target.value});
    }

	handleSubmit = () => {
		//generate a green div alert that gives a signed out message
		document.getElementById('alert-green').innerHTML='Signed out!';
		document.getElementById('alert-green').style.width="10vw";
		document.getElementById('alert-green').style.visibility='visible';
		setTimeout(function() {
			document.getElementById('alert-green').style.visibility='hidden';
		}, 5000); // <-- time in milliseconds
	}


	render() {
		if(this.state.loggedIn == false)
        {
            return <Redirect to='/login' />;
        }
		return (
			<div className = "main">
				<div className = "container">
					<div className = "menu">
						<Link to="/settings/general" className = "menu-button">
							General
						</Link>
						<Link to="/settings/appearance" className = "menu-button">
							Appearance
						</Link>
						<Link to="/settings/signout" className = "menu-button-active">
							Signout
						</Link>
					</div>
					<div className = "main">
						<div className = "content">
							<div className = "category-header">
								Signout
							</div>
							<div className = "field-text">
								<form method="post" action="/settings/signout" onSubmit={this.handleSubmit}>
                       				<input
                        				type="submit" 
                        				className="logout-button"
                        				value="Click Here to Sign Out"
                       				/>
                    			</form>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
		
	}
}