import * as actionTypes from '../actions/actionTypes';
import updateObject from '../../utility';
import moment from 'moment';

const INITIAL_STATE = {
	startDate: moment().startOf('date'),
	endDate: moment().endOf('date'),
	selectedTeam: '',
	name: '',
	showMine: false,
	isTabView: false,
	calendarFocused: null
};

const setStartDate = (state, action) => {
	return updateObject(state, { startDate: action.payload.startDate });
};

const setEndDate = (state, action) => {
	return updateObject(state, { endDate: action.payload.endDate });
};

const setName = (state, action) => {
	return updateObject(state, { name: action.payload.name });
};

const setTeamRoom = (state, action) => {
	return updateObject(state, { selectedTeam: action.payload.teamRoom });
};

const toggleMine = (state, action) => {
	let showMine = !state.showMine;
	return updateObject(state, { showMine, name: '' });
};

const toggleTabularView = (state, action) => {
	let isTabView = !state.isTabView;
	return updateObject(state, { isTabView });
};

const setCalendarFocused = (state, action) => {
	return updateObject(state, { calendarFocused: action.payload.calendarFocused });
};

export default (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case actionTypes.FILTER_SET_START_DATE:
			return setStartDate(state, action);
		case actionTypes.FILTER_SET_END_DATE:
			return setEndDate(state, action);
		case actionTypes.FILTER_SET_NAME:
			return setName(state, action);
		case actionTypes.FILTER_TOGGLE_SHOW_MINE:
			return toggleMine(state, action);
		case actionTypes.FILTER_TOGGLE_TABULAR_VIEW:
			return toggleTabularView(state, action);
		case actionTypes.FILTER_SET_CALENDAR_FOCUSED:
			return setCalendarFocused(state, action);
		case actionTypes.FILTER_SET_TEAM_ROOM:
			return setTeamRoom(state, action);
		default:
			return state;
	}
};
