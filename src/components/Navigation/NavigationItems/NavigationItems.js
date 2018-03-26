import React from 'react';
import classes from './NavigationItems.css';
import NavigationItem from './NavigationItem/NavigationItem';

const navigationItems = (props) => (
	<ul className={classes.NavigationItems}>
		<NavigationItem link="/" exact>
			Home
		</NavigationItem>
		{props.isAuthenticated ? <NavigationItem link="/dailyUpdates">Daily Updates</NavigationItem> : null}
		{props.isAuthenticated ? (
			<NavigationItem link="/logout">Logout</NavigationItem>
		) : (
			<NavigationItem link="/auth">Login</NavigationItem>
		)}
	</ul>
);

export default navigationItems;
