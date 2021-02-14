import React, { Component } from "react";
import { Router, Switch, Route } from "react-router-dom";
import './style/Settings.css';



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
					<div className = "setting-current">
						Kevin Huang
					</div>
					<div className = "setting-edit">
						Edit
					</div>
				</div>
				<div className = "field-text">
					<div className = "setting-name">
						Email Address
					</div>
					<div className = "setting-current">
						kevinhuang2k@gmail.com
					</div>
					<div className = "setting-edit">
						Edit
					</div>
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
					<div className = "setting-current">
						Current Setting
					</div>
					<div className = "setting-edit">
						Edit
					</div>
				</div>
				<div className = "field-text">
					<div className = "setting-name">
						Setting Name
					</div>
					<div className = "setting-current">
						Current Setting
					</div>
					<div className = "setting-edit">
						Edit
					</div>
				</div>
			</div>
		</div>
	);
}
function Navigation() {
	return (
		<div className = "navigation">
			Test
		</div>
	)
}



export default class Settings extends Component {
	constructor(props) {
		super(props);
		this.state = {
			page: 0,
		}
	}

	handleClick(i) {
		this.setState({
			page: i,
		});
		console.log(this.state.page)
	}
	render() {
		switch (this.state.page) {
			case 0:
				return (
					<div className = "main">
						<Navigation />
						<div className = "container">
							<div className = "menu">
								<div 
									className = "menu-button"
									onClick={() => this.handleClick(0)}
								>
									General
								</div>
								<div 
									className = "menu-button"
									onClick={() => this.handleClick(1)}
								>	
									Appearance
								</div>
							</div>
							<General />
						</div>
					</div>
				);
			case 1:
				return (
					<div className = "main">
						<Navigation />
						<div className = "container">
							<div className = "menu">
								<div 
									className = "menu-button"
									onClick={() => this.handleClick(0)}
								>
									General
								</div>
								<div 
									className = "menu-button"
									onClick={() => this.handleClick(1)}
								>	
									Appearance
								</div>
							</div>
							<Appearance />
						</div>
					</div>
				);

		}
		
	}
}