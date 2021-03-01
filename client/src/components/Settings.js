import React, { Component } from "react";
import { Router, Switch, Route } from "react-router-dom";
import './style/Settings.css';
import icon_edit from '../images/icon_edit.svg';
import {Redirect} from "react-router-dom";
import {isLoggedIn} from '../utils.js';

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

//props gets the page from Settings' state and returns the relevant div - conditional rendering
function CurPage(props){
	const page = props.page;
	switch(page){
		case 1:
			return <Appearance />;
	}
	return <General />;
}

export default class Settings extends Component {
	constructor(props) {
		super(props);
		this.state = {
			page: 0,
			loggedIn: true,
		}
	}


    componentDidMount() //we need to make sure we are actually logged in
    {                   
        console.log("Inside component did mount for settings page");
        isLoggedIn().then(loggedIn => this.setState({loggedIn: loggedIn}));
    }

	handleClick(i) {
		this.setState({
			page: i,
		});
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
					</div>
					<CurPage page={this.state.page}/>
				</div>
			</div>
		);
		
	}
}