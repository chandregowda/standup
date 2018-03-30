import React from 'react';
import { Link } from 'react-router-dom';

import classes from './Home.css';
import homeImage from '../../assets/images/standup-meeting.jpg';
import MainTitle from '../MainTitle/MainTitle';

const home = (props) => {
	return (
		<div className={classes.Home}>
			<MainTitle />
			<Link to="/auth">
				<img className={classes.HomeImage} src={homeImage} alt="Home" />
			</Link>
			<section>
				<h4>15 minutes of daily standup meeting to save hours wasted in daily meetings.</h4>
				<p>
					<em>Improves team efficiency to do better work!</em>
				</p>
			</section>
		</div>
	);
};
export default home;
