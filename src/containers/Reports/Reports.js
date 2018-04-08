import moment from 'moment';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';

import classes from './Reports.comp.css';
import Auxiliary from '../../hoc/Auxiliary/Auxiliary';
import MainTitle from '../../components/MainTitle/MainTitle';

import DailyUpdate from '../../components/DailyUpdate/DailyUpdate';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/WithErrorHandler/WithErrorHandler';
import * as actions from '../../store/actions/index';

import Filters from '../Filters/Filters';

// import FollowUps from '../FollowUps/FollowUps';

import noDataImage from '../../assets/images/nodata.jpg';

class Reports extends Component {
	state = {
		team: '',
		createdAt: null,
		calendarFocused: null,
		startDate: null,
		endDate: moment().endOf('date')
	};

	getReports = () => {
		if (this.props.filters.startDate && this.props.filters.endDate) {
			this.props.onDailyUpdatesFetch({
				token: this.props.token,
				accountName: null,
				createdAt: null,
				team: null,
				startDate: +this.props.filters.startDate.startOf('date'),
				endDate: +this.props.filters.endDate.endOf('date')
			});
		}
	};

	// componentDidMount() {
	// 	this.getReports();
	// }
	updateStartDate = () => {
		this.setState((prevState) => ({ startDate: this.props.filters.startDate }), this.getReports);
	};

	updateEndDate = () => {
		this.setState((prevState) => ({ endDate: this.props.filters.endDate }), this.getReports);
	};

	filterDailyUpdates = () => {
		let filteredDailyUpdates = this.props.dailyUpdates.filter((item) => {
			let myUpdates = true;
			if (this.props.filters.showMine) {
				myUpdates = item.accountName === this.props.accountName;
			}
			let name = true;

			if (this.props.filters.name) {
				name =
					item.accountName.toLowerCase().includes(this.props.filters.name.toLowerCase()) ||
					item.displayName.toLowerCase().includes(this.props.filters.name.toLowerCase());
			}

			return (
				myUpdates &&
				name &&
				(!this.props.filters.selectedTeam || item.teamRoom === this.props.filters.selectedTeam)
			);
		});
		return filteredDailyUpdates;
	};

	render() {
		let dailyUpdatesList = null,
			tabularList = null,
			tabContent = null;

		if (
			!this.state.startDate ||
			(this.state.startDate &&
				this.props.filters.startDate &&
				this.state.startDate.startOf('date').format('x') !==
					this.props.filters.startDate.startOf('date').format('x'))
		) {
			this.updateStartDate();
		}

		if (
			!this.state.endDate ||
			(this.state.endDate &&
				this.props.filters.endDate &&
				this.state.endDate.endOf('date').format('x') !== this.props.filters.endDate.endOf('date').format('x'))
		) {
			this.updateEndDate();
		}

		let filteredDailyUpdates = this.filterDailyUpdates();
		let itemList = null;
		if (this.props.loading) {
			dailyUpdatesList = <Spinner />;
		} else {
			itemList =
				this.props.filters.selectedTeam || this.props.filters.showMine || this.props.filters.name
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

		return (
			<div className={classes.Reports}>
				<div>
					<Auxiliary>
						<div className={classes.PrintShow}>
							<MainTitle />
						</div>

						<h2> Daily Standup Updates Report</h2>
						<Filters showNameFilter={true} />
					</Auxiliary>
				</div>

				{this.props.filters.isTabView ? (
					tabContent
				) : (
					<div className={classes.UpdatesContainer}>{dailyUpdatesList}</div>
				)}
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
		accountName: state.auth.accountName,
		filters: state.filters
	};
};
const mapDispatchToProps = (dispatch) => {
	return {
		onDailyUpdatesFetch: ({ token, accountName, createdAt, team, startDate, endDate }) => {
			return dispatch(actions.fetchDailyUpdates({ token, accountName, createdAt, team, startDate, endDate }));
		}
	};
};
export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(Reports, axios));
