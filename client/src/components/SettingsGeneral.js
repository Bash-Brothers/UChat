import React, { Component } from "react";
import { Link, Redirect } from 'react-router-dom';
import './style/Settings.css';
import icon_edit from '../images/icon_edit.svg';
import {isLoggedIn, getUserInfo} from '../utils.js';


export default class Settings extends Component {
	constructor(props) {
		super(props);
		this.state = {
			loggedIn: true,
			username: null,
			password: null,
			submittedName: null,
			name: null,
			passwordVerified: false,
		}
		this.handleNameSubmit = this.handleNameSubmit.bind(this);

	}

	getCurrentSettings = async() =>
	{
		const user = await getUserInfo();
		const settings = {username: user.username, name: user.name, password: user.password};
		return settings;
	}
	async componentDidMount() 
    {                   
		console.log("Inside component did mount for settings page");
        const loggedIn = await isLoggedIn();
        if (!loggedIn)
        {
            this.setState({loggedIn: false});
        }

		const settings = await this.getCurrentSettings();
		console.log("settings = ", settings);

		this.setState({loggedIn: loggedIn, username: settings.username, name: settings.name, password: settings.password })

    }

	handleChange = (event) => {
		console.log("inside handle change for", event.target.name);
        this.setState({[event.target.name]: event.target.value});
    }

	handleNameSubmit = async (event) =>
	{
		event.preventDefault();
		console.log("Inside handle name submit");

		if (this.state.submittedName== null)
		{
			console.log("Error: name field cannot be empty");
			// Note to frontend, let's have some code here that throws up this message
			// Use code 2 
			return; 
		}

		const response = await fetch('/change/name/'+this.state.username, 
			{
				method: 'POST',
				headers: {
				  'Content-Type': "application/json; charset=utf-8",
			  			},
			  body: JSON.stringify({submittedName: this.state.submittedName})
			} 
		)

		const res = await response.json();
		const returnCode = res.returnCode;

		if (returnCode != 0)
		{
			// database error
			return;
		}

		event.target.reset();
		this.setState({name: this.state.submittedName})

	}

	handleCurrentPassword = async (event) =>
	{
		event.preventDefault();
		console.log("Inside handle password confirm ");
		if (this.state.password == this.state.submittedCurrentPassword)
		{
			this.setState({passwordVerified: true});
		}
	}

	handleNewPasswordSubmit = async (event) =>
	{
		event.preventDefault();
		console.log("Inside handle new password submit");

		if (this.state.newPassword != this.state.newPasswordConfirm)
		{
			console.log("Passwords do not match");
			return;
			// Frontend display message
		}
		if (this.state.newPassword == undefined)
		{
			console.log("Password cannot be null");
			return;
			// Frontend display message
		}

		const response = await fetch('/change/password/'+this.state.username, 
								{
									method: 'POST',
									headers: {
									'Content-Type': "application/json; charset=utf-8",
											},
								body: JSON.stringify({newPassword: this.state.newPassword})
								});
		
		const res = await response.json();
		
		const returnCode = res.returnCode;

		if (returnCode == 0)
		{
			console.log("Password updated");
			// Frontend display message
		}
		else 
		{
			console.log("Error updating password");
			// Frontend display message
		}

		event.target.reset();


	}

	render() {
		console.log("this.state = ", this.state);
		if(this.state.loggedIn == false)
        {
            return <Redirect to='/login' />;
        }
		return (
			
			<div className = "main">
				<div className = "container">
					<div className = "menu">
						<Link to="/settings/general" className = "menu-button-active">
							General
						</Link>
						<Link to="/settings/appearance" className = "menu-button">
							Appearance
						</Link>
						<Link to="/settings/signout" className = "menu-button">
							Signout
						</Link>
					</div>
					<div className = "main">
						<div className = "content">
							<div className = "category-header">
								General Settings
							</div>
							<p className = "field-text">
								<div className = "setting-name">
									Name
								</div>
								<form onSubmit = {this.handleNameSubmit}>
                       				<input
                        				type="text" 
                	       				class="settings-input"
										name="submittedName"
            	           				placeholder={this.state.name}
										onChange = {this.handleChange}
                       				/>
									<input type="submit" value="submit" />
                    			</form>
								<div className = "setting-padding" />
							</p>
							<div id="reqpas">Request Password Change:</div>
							<p className = "field-text">
								<div className = "setting-name">
									Current Password
								</div>
								<form onSubmit = {this.handleCurrentPassword} >
                       				<input
                 	       				type="text" 
                           				class="settings-input"
										name = "submittedCurrentPassword"
										onChange = {this.handleChange}
                       				/>
								<input type="submit" value="submit" />
                    			</form>
                				<div className = "setting-padding" />
							</p>
							{this.state.passwordVerified ? 
							<div className = "field-text">  {/* conditonally render new password fields  */}
								<div className = "setting-name">
									New Password
								</div>
								<form onSubmit = {this.handleNewPasswordSubmit}>
                       				<input
                        				type="text" 
                	       				class="settings-input"
										name="newPassword"
										onChange = {this.handleChange}
                       				/>
								
								<div className = "setting-name">
									Confirm Password
								</div>
									<input
										type = "text"
										class ="settings-input"
										name="newPasswordConfirm"
										onChange = {this.handleChange}
									/>
									<input type="submit" value="submit" />
                    			</form>
								<div className = "setting-padding" />
							</div>
							:
							<div></div>} {/* end of conditional rendering  */}
						</div>
					</div>
				</div>
			</div>
		);
		
	}
}