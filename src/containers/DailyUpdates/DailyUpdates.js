import React, { Component } from 'react';
import classes from './DailyUpdates.css';
import Button from '../../components/UI/Button/Button';
// import DailyUpdateData from '../../components/DailyUpdateData/DailyUpdateData';
// import { Route } from 'react-router-dom';

class DailyUpdates extends Component {
	onAddNewClick = () => {
		this.props.history.push('/dailyUpdateData');
	};
	render() {
		return (
			<div className={classes.DailyUpdates}>
				<Button btnType="Success" clicked={this.onAddNewClick}>
					Add new updates
				</Button>
				<p>See All daily updates from here</p>
			</div>
		);
	}
}

export default DailyUpdates;
