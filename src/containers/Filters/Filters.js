import React, { Component } from 'react';
import { connect } from 'react-redux';
import { DateRangePicker } from 'react-dates';
import uuid from 'uuid';

import Input from '../../components/UI/Input/Input';
import * as actions from '../../store/actions/index';
import withErrorHandler from '../../hoc/WithErrorHandler/WithErrorHandler';
import axios from '../../axios-dailyUpdates';
import {
	setStartDate,
	setEndDate,
	setCalendarFocused,
	toggleTabularView,
	toggleShowMine,
	setName,
	setTeamRoom
} from '../../store/actions/index';

import classes from './Filters.comp.css';

class Filters extends Component {
	componentDidMount() {
		if (this.props.teamRooms.length === 0) {
			this.props.onTeamRoomsFetch();
		}
	}

	handleDateChange = ({ startDate, endDate }) => {
		this.props.setStartDate(startDate);
		this.props.setEndDate(endDate);
	};
	handleFocusChanged = (calendarFocused) => {
		this.props.setCalendarFocused(calendarFocused);
	};

	onSelectChange = (event, identifier) => {
		let selectedTeam = event.target.value;
		this.props.setTeamRoom(selectedTeam);
	};

	onInputChange = (event, identifier) => {
		let name = event.target.value.trim();
		this.props.setName(name);
	};

	handleShowMine = () => {
		this.props.toggleShowMine();
	};

	handleView = () => {
		this.props.toggleTabularView();
	};

	render() {
		let selectOptions = [ { value: '', displayName: 'All Team Rooms', _id: '0' } ].concat(this.props.teamRooms);
		let selectElement = (
			<Input
				changed={(event) => this.onSelectChange(event)}
				elementType="select"
				options={selectOptions}
				elementConfig={{ options: [] }}
				value={this.props.filters.selectedTeam}
			/>
		);

		return (
			<div className={classes.Filters}>
				<div className={classes.PrintHide}>
					<div className={classes.FilterContainer}>
						<DateRangePicker
							startDate={this.props.filters.startDate}
							startDateId={uuid()} // PropTypes.string.isRequired,
							endDate={this.props.filters.endDate}
							endDateId={uuid()} // PropTypes.string.isRequired
							onDatesChange={this.handleDateChange}
							focusedInput={this.props.filters.calendarFocused}
							onFocusChange={this.handleFocusChanged}
							showDefaultInputIcon={true}
							showClearDates={false}
							numberOfMonths={1}
							isOutsideRange={() => false}
							minimumNights={0}
							small
						/>
						<div>{selectElement}</div>
						{this.props.showNameFilter && (
							<div>
								<Input
									changed={(event) => this.onInputChange(event)}
									elementType="text"
									options={null}
									elementConfig={{
										type: 'text',
										placeholder: 'Filter by name',
										readOnly: this.props.filters.showMine
									}}
									value={this.props.filters.name}
								/>
							</div>
						)}
						<div className={classes.CheckboxContainer}>
							<label>
								<input type="checkbox" onChange={this.handleShowMine} /> View only my updates
							</label>
						</div>
						<div className={classes.CheckboxContainer}>
							<label>
								<input type="checkbox" onChange={this.handleView} /> View Tabular Report
							</label>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		teamRooms: state.teamRooms.teamRooms,
		teamRoomsMap: state.teamRooms.teamRoomsMap,
		accountName: state.auth.accountName,
		filters: state.filters
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		onTeamRoomsFetch: (owner = null, id = null) => dispatch(actions.fetchTeamRooms({ owner, id })),
		setStartDate: (startDate) => dispatch(setStartDate(startDate)),
		setEndDate: (endDate) => dispatch(setEndDate(endDate)),
		setTeamRoom: (teamRoom) => dispatch(setTeamRoom(teamRoom)),
		setName: (name) => dispatch(setName(name)),
		toggleShowMine: () => dispatch(toggleShowMine()),
		toggleTabularView: () => dispatch(toggleTabularView()),
		setCalendarFocused: (calendarFocused) => dispatch(setCalendarFocused(calendarFocused))
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(Filters, axios));
