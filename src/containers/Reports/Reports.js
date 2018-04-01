import moment from 'moment';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { SingleDatePicker } from 'react-dates';
import axios from 'axios';

import classes from './Reports.css';
import Auxiliary from '../../hoc/Auxiliary/Auxiliary';
import MainTitle from '../../components/MainTitle/MainTitle';
import Input from '../../components/UI/Input/Input';

import DailyUpdate from '../../components/DailyUpdate/DailyUpdate';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/WithErrorHandler/WithErrorHandler';
import * as actions from '../../store/actions/index';

class Reports extends Component {
	getReports = () => {
		this.props.onDailyUpdatesFetch(this.props.token, null, +this.state.createdAt.startOf('date'), null);
	};
	componentDidMount() {
		this.getReports();
		if (this.props.teamRooms.length === 0) {
			this.props.onTeamRoomsFetch();
		}
	}

	state = {
		team: '',
		selectedTeam: '',
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

	filterDailyUpdates = () => {
		let filteredDailyUpdates = this.props.dailyUpdates.filter((item) => {
			return !this.state.selectedTeam || item.teamRoom === this.state.selectedTeam;
		});
		return filteredDailyUpdates;
	};

	onInputChange = (event, identifier) => {
		let selectedTeam = event.target.value;
		this.setState(() => ({
			selectedTeam: selectedTeam
		}));
	};

	render() {
		let dailyUpdatesList = null;
		let filteredDailyUpdates = this.filterDailyUpdates();

		if (this.props.loading) {
			dailyUpdatesList = <Spinner />;
		} else {
			let itemList = this.state.selectedTeam ? filteredDailyUpdates : this.props.dailyUpdates;

			dailyUpdatesList = itemList.map((du, index) => {
				let teamRoomDisplayName = this.props.teamRoomsMap[du.teamRoom];
				return (
					<DailyUpdate
						data={du}
						key={du._id}
						accountName={this.props.accountName}
						teamRoomDisplayName={teamRoomDisplayName}
					/>
				);
			});
		}

		let selectOptions = [ { value: '', displayName: 'All Team Room Updates', _id: '0' } ].concat(
			this.props.teamRooms
		);
		let selectElement = (
			<Input
				changed={(event) => this.onInputChange(event)}
				elementType="select"
				options={selectOptions}
				elementConfig={{ options: [] }}
				value={this.state.selectedTeam}
			/>
		);

		return (
			<div className={classes.Reports}>
				<Auxiliary>
					<div className={classes.PrintShow}>
						<MainTitle />
					</div>
					<h2> Daily Scrum Update Report</h2>
					<div className={classes.PrintHide}>
						<div className={classes.FilterContainer}>
							<SingleDatePicker
								date={this.state.createdAt}
								onDateChange={this.handleDateChange}
								focused={this.state.calendarFocused}
								onFocusChange={this.handleFocusChanged}
								numberOfMonths={1}
								showDefaultInputIcon={true}
								isOutsideRange={() => false}
								small
							/>
							<div>{selectElement}</div>
						</div>
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
		teamRooms: state.teamRooms.teamRooms,
		teamRoomsMap: state.teamRooms.teamRoomsMap,
		accountName: state.auth.accountName
	};
};
const mapDispatchToProps = (dispatch) => {
	return {
		onTeamRoomsFetch: (owner = null, id = null) => dispatch(actions.fetchTeamRooms({ owner, id })),
		onDailyUpdatesFetch: (token, accountName, createdAt, team) =>
			dispatch(actions.fetchDailyUpdates({ token, accountName, createdAt, team }))
	};
};
export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(Reports, axios));
