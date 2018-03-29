import React from 'react';
// import { Link } from 'react-router-dom';

import classes from './Home.css';
import homeImage from '../../assets/images/standup-meeting.jpg';
import kshipaniImage from '../../assets/images/kshipani.png';

const home = (props) => {
	return (
		<div className={classes.Home}>
			<div>
				<section className={classes.Jumbotext}>
					<div className={classes.KshipaniContainer}>
						<img src={kshipaniImage} alt="khipani" className={classes.KshipaniImage} />Kshipani
					</div>
				</section>
				<p className={classes.Subtitle}>Missile Tracker</p>
			</div>
			<img src={homeImage} alt="Home" />
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
