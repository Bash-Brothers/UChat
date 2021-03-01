import React, { Component } from "react";
import { Link } from 'react-router-dom';
import './style/Settings.css';
import icon_edit from '../images/icon_edit.svg';



export default class Settings extends Component {
	constructor(props) {
		super(props);
		this.state = {
			page: 0,
		}
	}

	handleChange = (event) => {
        this.setState({[event.target.name]: event.target.value});
    }


	handleSubmit =  async (event) => {
        event.preventDefault();
        const result = await fetch("/settings/signout", 
                  {
                    method: 'POST',
                    headers: {
                      'Content-Type': "application/json; charset=utf-8",
                  },
                  body: JSON.stringify(this.state) /* this is the data being posted */
        })

        const res = await result.json();  /* this is the res sent by the backend */

        // currently, I return a successCode depending on what happened in the backend
        // when successCode = 0, the user is logged in so we change state.isLoggedIn
        // the successCode also has other states such as for "user not found", "incorrect pwd"
        // so we can either getElementById or something similar to change the display according to that
        event.target.reset(); // clear out form entries
        this.setState({isLoggedIn: !res.successCode});
        };



	render() {
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
								<form action="/settings/signout" onSubmit={this.handleSubmit}>
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