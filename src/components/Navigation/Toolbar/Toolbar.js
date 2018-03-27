import React from 'react';
import classes from './Toolbar.css';
import Logo from '../../Logo/Logo';
import NavigationItems from '../NavigationItems/NavigationItems';
import DrawerToggle from '../SideDrawer/DrawerToggle/DrawerToggle';

const toolbar = (props) => {
	let displayName = localStorage.getItem('displayName') || null;
	return (
		<header className={classes.Toolbar}>
			<DrawerToggle clicked={props.toggleSideDrawer} />
			<div className={classes.Logo}>
				<Logo />
			</div>
			{props.isAuthenticated && (
				<div className={classes.NameContainer}>
					Welcome, <span className={classes.DisplayName}>{displayName}</span>
				</div>
			)}
			<nav className={classes.DesktopOnly}>
				<NavigationItems isAuthenticated={props.isAuthenticated} />
			</nav>
		</header>
	);
};

export default toolbar;
