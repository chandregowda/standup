import moment from 'moment';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { DateRangePicker } from 'react-dates';
import axios from 'axios';
import uuid from 'uuid';

import classes from './Reports.css';
import Auxiliary from '../../hoc/Auxiliary/Auxiliary';
import MainTitle from '../../components/MainTitle/MainTitle';
import Input from '../../components/UI/Input/Input';

import DailyUpdate from '../../components/DailyUpdate/DailyUpdate';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/WithErrorHandler/WithErrorHandler';
import * as actions from '../../store/actions/index';

import noDataImage from '../../assets/images/nodata.jpg';

class Reports extends Component {
	state = {
		team: '',
		selectedTeam: '',
		nameFilter: '',
		showOnlyMyUpdates: false,
		isTabView: false,
		createdAt: moment(),
		calendarFocused: null,
		startDate: moment().startOf('date'),
		endDate: moment().endOf('date')
	};

	getReports = () => {
		if (this.state.startDate && this.state.endDate) {
			this.props.onDailyUpdatesFetch({
				token: this.props.token,
				accountName: null,
				createdAt: +this.state.createdAt.startOf('date'),
				team: null,
				startDate: this.state.startDate ? +this.state.startDate.startOf('date') : null,
				endDate: this.state.endDate ? +this.state.endDate.endOf('date') : null
			});
		}
	};
	componentDidMount() {
		this.getReports();
		if (this.props.teamRooms.length === 0) {
			this.props.onTeamRoomsFetch();
		}
	}

	handleDateChange = ({ startDate, endDate }) => {
		// if (startDate && endDate) {
		this.setState(
			() => ({
				startDate,
				endDate
			}),
			() => {
				// console.log('Calling Fetch after setstate is completed');
				this.getReports();
			}
		);
		// }
	};

	handleFocusChanged = (calendarFocused) => {
		this.setState(() => ({
			calendarFocused
		}));
	};

	filterDailyUpdates = () => {
		let filteredDailyUpdates = this.props.dailyUpdates.filter((item) => {
			let myUpdates = true;
			if (this.state.showOnlyMyUpdates) {
				myUpdates = item.accountName === this.props.accountName;
			}
			let nameFilter = true;

			if (this.state.nameFilter) {
				nameFilter =
					item.accountName.toLowerCase().includes(this.state.nameFilter.toLowerCase()) ||
					item.displayName.toLowerCase().includes(this.state.nameFilter.toLowerCase());
			}

			return myUpdates && nameFilter && (!this.state.selectedTeam || item.teamRoom === this.state.selectedTeam);
		});
		// console.log(filteredDailyUpdates);
		return filteredDailyUpdates;
	};

	onSelectChange = (event, identifier) => {
		let selectedTeam = event.target.value;
		this.setState(() => ({
			selectedTeam: selectedTeam
		}));
	};

	onInputChange = (event, identifier) => {
		let nameFilter = event.target.value.trim();
		this.setState(() => ({
			nameFilter: nameFilter
		}));
	};

	handleShowMyUpdates = () => {
		this.setState((prevState) => ({
			showOnlyMyUpdates: !prevState.showOnlyMyUpdates,
			nameFilter: ''
		}));
	};
	handleView = () => {
		this.setState((prevState) => ({
			isTabView: !prevState.isTabView
		}));
	};

	render() {
		let dailyUpdatesList = null,
			tabularList = null,
			tabContent = null;
		let filteredDailyUpdates = this.filterDailyUpdates();
		let itemList = null;
		if (this.props.loading) {
			dailyUpdatesList = <Spinner />;
		} else {
			itemList =
				this.state.selectedTeam || this.state.showOnlyMyUpdates || this.state.nameFilter
					? filteredDailyUpdates
					: this.props.dailyUpdates;

			if (itemList.length === 0) {
				dailyUpdatesList = (
					<Auxiliary>
						<div className={classes.NoData}>
							<img src={noDataImage} alt="No Data" />
							<p>Consider changing the filters applied !</p>
						</div>
					</Auxiliary>
				);
			} else {
				dailyUpdatesList = itemList.map((du, index) => {
					let teamRoomDisplayName = this.props.teamRoomsMap[du.teamRoom] || du.teamRoom; // In case some one deletes the existing team room
					return (
						<Auxiliary key={du._id}>
							<DailyUpdate
								data={du}
								accountName={this.props.accountName}
								teamRoomDisplayName={teamRoomDisplayName}
								startDate={this.state.startDate}
								endDate={this.state.endDate}
							/>
							<div className={classes.pagebreak}> </div>
						</Auxiliary>
					);
				});
				// This should be moved out to another component
				tabularList = itemList.map((du, index) => {
					let teamRoomDisplayName = this.props.teamRoomsMap[du.teamRoom] || du.teamRoom; // In case some one deletes the existing team room
					return (
						<Auxiliary key={du._id}>
							<div className={classes.TabDetails}>
								<div className={classes.pagebreakTabReport}> </div>

								<article className={classes.Member}>
									<div className={classes.User}>{du.displayName}</div>
									<div className={classes.TeamRoom}>{teamRoomDisplayName}</div>
									<div className={classes.CreatedAt}>
										{moment.unix(du.createdAt / 1000).format('dddd, MMMM Do YYYY')}
									</div>
								</article>
								<article className={classes.Comment}>
									<pre> {du.yesterday} </pre>
								</article>
								<article className={classes.Comment}>
									<pre> {du.today} </pre>
								</article>
								<article className={classes.Comment}>
									<pre> {du.obstacles} </pre>
								</article>
							</div>
						</Auxiliary>
					);
				});

				tabContent = (
					<section className={classes.TabularContainer}>
						<div className={classes.TabHeader}>
							<article className={classes.Member}>Member</article>
							<article>What I did last day</article>
							<article>What I will do today</article>
							<article>What are my Obstacle</article>
						</div>
						{tabularList}
					</section>
				);
			}
		}

		let selectOptions = [ { value: '', displayName: 'All Team Room Updates', _id: '0' } ].concat(
			this.props.teamRooms
		);
		let selectElement = (
			<Input
				changed={(event) => this.onSelectChange(event)}
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
							<DateRangePicker
								startDate={this.state.startDate}
								startDateId={uuid()} // PropTypes.string.isRequired,
								endDate={this.state.endDate}
								endDateId={uuid()} // PropTypes.string.isRequired
								onDatesChange={this.handleDateChange}
								focusedInput={this.state.calendarFocused}
								onFocusChange={this.handleFocusChanged}
								showDefaultInputIcon={true}
								showClearDates={false}
								numberOfMonths={1}
								isOutsideRange={() => false}
								minimumNights={0}
								small
							/>
							<div>{selectElement}</div>
							<div>
								<Input
									changed={(event) => this.onInputChange(event)}
									elementType="text"
									options={null}
									elementConfig={{
										type: 'text',
										placeholder: 'Filter by name',
										readOnly: this.state.showOnlyMyUpdates
									}}
									value={this.state.nameFilter}
								/>
							</div>
							<div className={classes.CheckboxContainer}>
								<label>
									<input type="checkbox" onChange={this.handleShowMyUpdates} /> View only my updates
								</label>
							</div>
							<div className={classes.CheckboxContainer}>
								<label>
									<input type="checkbox" onChange={this.handleView} /> View Tabular Report
								</label>
							</div>
						</div>
					</div>
				</Auxiliary>
				{this.state.isTabView ? tabContent : <div className={classes.UpdatesContainer}>{dailyUpdatesList}</div>}
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
		onDailyUpdatesFetch: ({ token, accountName, createdAt, team, startDate, endDate }) => {
			return dispatch(actions.fetchDailyUpdates({ token, accountName, createdAt, team, startDate, endDate }));
		}
	};
};
export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(Reports, axios));
