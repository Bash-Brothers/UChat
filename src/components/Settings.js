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
		}
	}

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
					<CurPage page={this.state.page}/>
				</div>
			</div>
		);
		
	}
}