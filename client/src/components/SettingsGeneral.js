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
			document.getElementById('alert-red').innerHTML='Name field cannot be empty'
			document.getElementById('alert-red').style.width='12vw';
			document.getElementById('alert-red').style.visibility='visible';
    
        	setTimeout(function() {
            	document.getElementById('alert-red').style.visibility='hidden';
        	}, 3000); // <-- time in milliseconds
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


		var alertDiv = (!res.returnCode) ? 'alert-green' : 'alert-red';
        var alertMessage = (!res.returnCode) ? 'Name change successful!' : 'Database error :/';
        
        //create an alert based on if registartion is successful or not
        document.getElementById(alertDiv).innerHTML=alertMessage;
        document.getElementById(alertDiv).style.width="10vw";
        document.getElementById(alertDiv).style.visibility='visible';
        setTimeout(function() {
            document.getElementById(alertDiv).style.visibility='hidden';
        }, 3000); // <-- time in milliseconds
		
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
			event.target.reset();
			this.setState({passwordVerified: true});
		}
		else {
			document.getElementById('alert-red').innerHTML='Incorrect password'
			document.getElementById('alert-red').style.width='12vw';
			document.getElementById('alert-red').style.visibility='visible';
    
        	setTimeout(function() {
            	document.getElementById('alert-red').style.visibility='hidden';
        	}, 3000); // <-- time in milliseconds
		}
	}

	handleNewPasswordSubmit = async (event) =>
	{
		event.preventDefault();
		console.log("Inside handle new password submit");

		if (this.state.newPassword != this.state.newPasswordConfirm)
		{
			console.log("Passwords do not match");
			document.getElementById('alert-red').innerHTML='Passwords do not match'
			document.getElementById('alert-red').style.width='12vw';
			document.getElementById('alert-red').style.visibility='visible';
    
        	setTimeout(function() {
            	document.getElementById('alert-red').style.visibility='hidden';
        	}, 3000); // <-- time in milliseconds
			return;
			// Frontend display message
		}
		if (this.state.newPassword == undefined)
		{
			console.log("Password cannot be null");
			document.getElementById('alert-red').innerHTML='Password field cannot be empty'
			document.getElementById('alert-red').style.width='20vw';
			document.getElementById('alert-red').style.visibility='visible';
    
        	setTimeout(function() {
            	document.getElementById('alert-red').style.visibility='hidden';
        	}, 3000); // <-- time in milliseconds
			return;
			// Frontend display message
		}
		console.log(this.state.newPassword)

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
		
		var alertDiv = (!returnCode) ? 'alert-green' : 'alert-red';
		var alertMessage = (!returnCode) ? 'Password updated!' : 'Error updating password';

		console.log(alertMessage);
		document.getElementById(alertDiv).innerHTML=alertMessage;
		document.getElementById(alertDiv).style.width='12vw';
		document.getElementById(alertDiv).style.visibility='visible';

		setTimeout(function() {
			document.getElementById(alertDiv).style.visibility='hidden';
		}, 3000); // <-- time in milliseconds

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

							<div className = "field-text">
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
									<input className="settings-submit" type="submit" value=" " />
                    			</form>
								<div className = "setting-padding" />
							</div>
							<div className="category-header">Change Password</div>
							<div className = "field-text">
								<div className = "setting-name">
									Current Password
								</div>
								<form onSubmit = {this.handleCurrentPassword} >
                       				<input
                 	       				type="password" 
                           				class="settings-input"
										name = "submittedCurrentPassword"
										onChange = {this.handleChange}
                       				/>
								<input type="submit" value=" " className="settings-submit"/>
                    			</form>
                				<div className = "setting-padding" />
							</div>
							{this.state.passwordVerified ? 
							<div>
							<form id="changePW" onSubmit = {this.handleNewPasswordSubmit}/>
							<div className = "field-text">  {/* conditonally render new password fields  */}
								<div className = "setting-name">
									New Password
								</div>
								<div>
                       			<input
                       				form="changePW"
                        			type="password" 
                	       			className="settings-input"
									name="newPassword"
									onChange = {this.handleChange}
                       			/>
                       			<input className="settings-submit-placeholder" type="submit" value=" " disabled/> {/*this is a jank AF solution but it works for now*/}
                       			</div>
                       			<div className ="setting-padding"/>
                       		</div>
                       		<div className="field-text">
								<div className = "setting-name">
									Confirm Password
								</div>
								<div>
									<input
										form="changePW"
										type = "password"
										className ="settings-input"
										name="newPasswordConfirm"
										onChange = {this.handleChange}
									/>
									<input form="changePW" className="settings-submit" type="submit" value=" " />
								</div>
								<div className = "setting-padding" />
							</div>
							</div>
							:
							<div>
							<div className = "field-text-disabled">  {/* conditonally render new password fields  */}
								<div className = "setting-name">
									New Password
								</div>
								<form>
                       			<input
                       				form="changePW"
                        			type="password" 
                	       			className="settings-input"
									name="newPassword"
									onChange = {this.handleChange}
									disabled
                       			/>
                       			<input className="settings-submit-placeholder" type="submit" value=" " disabled/> {/*this is a jank AF solution but it works for now*/}
                       			</form>
                       			<div className ="setting-padding"/>
                       		</div>
                       		<div className="field-text-disabled">
								<div className = "setting-name">
									Confirm Password
								</div>
								<form>
									<input
										form="changePW"
										type = "password"
										className ="settings-input"
										name="newPasswordConfirm"
										onChange = {this.handleChange}
										disabled
									/>
									<input className="settings-submit" type="submit" value=" " disabled/>
								</form>
								<div className = "setting-padding" />
							</div>
							</div>} {/* end of conditional rendering  */}
						</div>
					</div>
				</div>
			</div>
		);
		
	}
}