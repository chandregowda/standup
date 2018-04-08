import React from 'react';
import logoImage from '../../assets/images/kshipani.png';
import classes from './Logo.comp.css';
import { Link } from 'react-router-dom';

const logo = (props) => (
	<div className={classes.Logo}>
		<Link to="/" tooltip="Home">
			<img src={logoImage} alt="Home Logo" tooltip="Home" />
		</Link>
		<span className={classes.LogoText}> Kshipani</span>
	</div>
);
export default logo;
