import React from 'react';
import classes from './NavigationItems.css';
import NavigationItem from './NavigationItem/NavigationItem';
import Auxiliary from '../../../hoc/Auxiliary/Auxiliary';

const navigationItems = (props) => (
	<ul className={classes.NavigationItems}>
		<NavigationItem link="/" exact>
			Home
		</NavigationItem>
		{props.isAuthenticated ? (
			<Auxiliary>
				<NavigationItem link="/dailyUpdates">Daily Updates</NavigationItem>
				<NavigationItem link="/reports">Reports</NavigationItem>
				<NavigationItem link="/teamRooms">Team Rooms</NavigationItem>
			</Auxiliary>
		) : null}
		{props.isAuthenticated ? (
			<NavigationItem link="/logout">Logout</NavigationItem>
		) : (
			<NavigationItem link="/auth">Login</NavigationItem>
		)}
	</ul>
);

export default navigationItems;
