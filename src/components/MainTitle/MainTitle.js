import React from 'react';
import classes from './MainTitle.css';
import kshipaniImage from '../../assets/images/kshipani.png';

const mainTitle = (props) => {
	return (
		<div>
			<section className={classes.Jumbotext}>
				<div className={classes.KshipaniContainer}>
					<img src={kshipaniImage} alt="khipani" className={classes.KshipaniImage} />
					Kshipani
				</div>
			</section>
			<p className={classes.Subtitle}>Mission Possible</p>
		</div>
	);
};

export default mainTitle;
