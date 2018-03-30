import moment from 'moment';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { SingleDatePicker } from 'react-dates';
import axios from 'axios';
import classes from './Reports.css';
import Auxiliary from '../../hoc/Auxiliary/Auxiliary';
import MainTitle from '../../components/MainTitle/MainTitle';

// import Button from '../../components/UI/Button/Button';
// import Input from '../../components/UI/Input/Input';
import DailyUpdate from '../../components/DailyUpdate/DailyUpdate';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/WithErrorHandler/WithErrorHandler';
import * as actions from '../../store/actions/index';

class Reports extends Component {
	getReports = () => {
		// this.props.onDailyUpdatesFetch(
		// 	this.props.token,
		// 	this.props.userId,
		// 	+this.state.createdAt.startOf('date'),
		// 	this.state.team
		// );
		this.props.onDailyUpdatesFetch(this.props.token, null, +this.state.createdAt.startOf('date'), null);
	};
	componentDidMount() {
		this.getReports();
	}

	state = {
		team: 'agni',
		createdAt: moment(),
		calendarFocused: false
	};

	handleDateChange = (createdAt) => {
		if (createdAt) {
			this.setState(
				() => ({
					createdAt
				}),
				() => {
					console.log('Calling Fetch after setstate is completed');
					this.getReports();
				}
			);
		}
	};

	handleFocusChanged = ({ focused }) => {
		this.setState(() => ({
			calendarFocused: focused
		}));
	};

	render() {
		let dailyUpdatesList = null;

		if (this.props.loading) {
			dailyUpdatesList = <Spinner />;
		} else {
			dailyUpdatesList = this.props.dailyUpdates.map((du, index) => {
				return <DailyUpdate data={du} key={du._id} />;
			});
		}

		return (
			<div className={classes.Reports}>
				<Auxiliary>
					<div className={classes.PrintShow}>
						<MainTitle />
					</div>
					<h2> Daily Scrum Update Report</h2>
					<div className={classes.PrintHide}>
						<SingleDatePicker
							date={this.state.createdAt}
							onDateChange={this.handleDateChange}
							focused={this.state.calendarFocused}
							onFocusChange={this.handleFocusChanged}
							numberOfMonths={1}
							showDefaultInputIcon={() => true}
							isOutsideRange={() => false}
							small
						/>
					</div>
					<h4>{this.state.createdAt.format('dddd, MMMM Do YYYY')}</h4>
				</Auxiliary>
				<div className={classes.UpdatesContainer}>{dailyUpdatesList}</div>
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		loading: state.dailyUpdates.loading,
		dailyUpdates: state.dailyUpdates.dailyUpdates,
		token: state.auth.token,
		userId: state.auth.userId
	};
};
const mapDispatchToProps = (dispatch) => {
	return {
		onDailyUpdatesFetch: (token, userId, createdAt, team) =>
			dispatch(actions.fetchDailyUpdates({ token, userId, createdAt, team }))
	};
};
export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(Reports, axios));
