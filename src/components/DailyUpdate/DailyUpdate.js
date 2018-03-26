import React, { Component } from 'react';
import classes from './DailyUpdate.css';

class DailyUpdates extends Component {
	render() {
		return (
			<div className={classes.DailyUpdates}>
				<h3 style={{ color: 'red' }}>Your Updates</h3>
				<p>Form Elements here...</p>
			</div>
		);
	}
}

export default DailyUpdates;
