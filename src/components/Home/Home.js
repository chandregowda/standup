import React from 'react';
// import { Link } from 'react-router-dom';

import classes from './Home.css';
import homeImage from '../../assets/images/standup-meeting.jpg';

const home = (props) => {
	return (
		<div className={classes.Home}>
			<div>
				<p className={classes.Jumbotext}> Daily Scrum </p>
			</div>
			<img src={homeImage} alt="Home" />
		</div>
	);
};
export default home;
