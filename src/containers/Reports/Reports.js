import React, { Component } from 'react';
import classes from './Reports.css';
import Auxiliary from '../../hoc/Auxiliary/Auxiliary';
import moment from 'moment';

import { SingleDatePicker } from 'react-dates';

// import Button from '../../components/UI/Button/Button';
// import Input from '../../components/UI/Input/Input';
import Spinner from '../../components/UI/Spinner/Spinner';

class Reports extends Component {
	state = {
		loading: false,
		createdAt: moment(),
		calendarFocused: false
	};

	handleDateChange = (createdAt) => {
		if (createdAt) {
			this.setState(() => ({
				createdAt
			}));
		}
	};

	handleFocusChanged = ({ focused }) => {
		this.setState(() => ({
			calendarFocused: focused
		}));
	};

	render() {
		let reportList = (
			<Auxiliary>
				<h2> Daily Scrum Update Report</h2>
				<h4>{this.state.createdAt.format('dddd, MMMM Do YYYY')}</h4>
			</Auxiliary>
		);
		if (this.props.loading) {
			reportList = <Spinner />;
		}

		return (
			<div className={classes.Reports}>
				<SingleDatePicker
					date={this.state.createdAt}
					onDateChange={this.handleDateChange}
					focused={this.state.calendarFocused}
					onFocusChange={this.handleFocusChanged}
					numberOfMonths={1}
					isOutsideRange={() => false}
					small
				/>

				{reportList}
			</div>
		);
	}
}

export default Reports;
