import React from 'react';
import classes from './SideDrawer.css';
import Logo from '../../Logo/Logo';
import NavigationItems from '../NavigationItems/NavigationItems';
import Backdrop from '../../UI/Backdrop/Backdrop';
import Auxiliary from '../../../hoc/Auxiliary/Auxiliary';

const sideDrawer = (props) => {
	let attachedClasses = [ classes.SideDrawer, classes.Close ];
	if (props.displaySideDrawer) {
		attachedClasses = [ classes.SideDrawer, classes.Open ];
	}
	return (
		<Auxiliary>
			<Backdrop show={props.displaySideDrawer} clicked={props.closeSideDrawer} />
			<div className={attachedClasses.join(' ')}>
				<div className={classes.Logo}>
					<Logo />
				</div>
				<nav>
					<NavigationItems isAuthenticated={props.isAuthenticated} />
				</nav>
			</div>
		</Auxiliary>
	);
};
export default sideDrawer;
