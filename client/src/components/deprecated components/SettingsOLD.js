import React, { Component } from "react";
import { Router, Switch, Route } from "react-router-dom";
import './style/Settings.css';
import icon_edit from '../images/icon_edit.svg';



function General() {
	return (
		<div className = "main">
			<div className = "content">
				<div className = "category-header">
					General Settings
				</div>
				<div className = "field-text">
					<div className = "setting-name">
						Name
					</div>
					<form>
                        <input
                    	    type="text" 
                	        class="settings-input"
            	            placeholder="current setting"
                        />
                    </form>
					<div className = "setting-padding" />

				</div>
				<div className = "field-text">
					<div className = "setting-name">
						Email Address
					</div>
					<form>
                        <input
                 	        type="text" 
                            class="settings-input"
                            placeholder="current setting"
                        />
                    </form>
                <div className = "setting-padding" />
				</div>
			</div>
		</div>
	);
}

function Appearance() {
	return (
		<div className = "main">
			
			<div className = "content">
				<div className = "category-header">
					Appearance Settings
				</div>
				<div className = "field-text">
					<div className = "setting-name">
						Site Theme
					</div>
					<form>
                        <input
                            type="text" 
                            class="settings-input"
                            placeholder="current setting"
                        />
                    </form>
					<div className = "setting-padding" />
				</div>
				<div className = "field-text">
					<div className = "setting-name">
						Setting Name
					</div>
					<form>
                        <input
                            type="text" 
                            class="settings-input"
                            placeholder="current setting"
                        />
                    </form>
					<div className = "setting-padding" />
				</div>
			</div>
		</div>
	);
}

function Signout() {
	return (
		<div className = "main">
			
			<div className = "content">
				<div className = "category-header">
					Signout
				</div>
				<form onSubmit={this.handleSubmit}>
                    <input
                        type="submit"
                        class="signout-button"
                        value="Click to Sign Out"
                    />     
                </form>
			</div>
		</div>
	);
}

//props gets the page from Settings' state and returns the relevant div - conditional rendering
function CurPage(props){
	const page = props.page;
	switch(page){
		case 1:
			return <Appearance />;
			break;
		case 2: 
			return <Signout />;
			break;
	}
	return <General />;
}

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
        const result = await fetch("/login", 
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


	handleClick(i) {
		this.setState({
			page: i,
		});
	}

	

	render() {
		return (
			<div className = "main">
				<div className = "container">
					<div className = "menu">
						<div 
							className = {(this.state.page === 0) ? "menu-button-active" : "menu-button"}
							onClick={() => this.handleClick(0)}
						>
							General
						</div>
						<div 
							className = {(this.state.page === 1) ? "menu-button-active" : "menu-button"}
							onClick={() => this.handleClick(1)}
						>	
							Appearance
						</div>
						<div 
							className = {(this.state.page === 2) ? "menu-button-active" : "menu-button"}
							onClick={() => this.handleClick(2)}
						>	
							Signout
						</div>
					</div>
					<CurPage page={this.state.page}/>
				</div>
			</div>
		);
		
	}
}