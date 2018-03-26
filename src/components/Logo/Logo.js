import React from 'react';
import logoImage from '../../assets/images/standup-meeting.jpg';
import classes from './Logo.css';
import { Link } from 'react-router-dom';

const logo = (props) => (
	<div className={classes.Logo}>
		<Link to="/" tooltip="Home">
			<img src={logoImage} alt="Home Logo" tooltip="Home" />
		</Link>
	</div>
);
export default logo;
