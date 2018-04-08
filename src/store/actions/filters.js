import * as actionTypes from './actionTypes';

export const setTeamRoom = (teamRoom = '') => ({
	type: actionTypes.FILTER_SET_TEAM_ROOM,
	payload: { teamRoom }
});

export const setName = (name = '') => ({
	type: actionTypes.FILTER_SET_NAME,
	payload: { name }
});

export const toggleShowMine = () => ({
	type: actionTypes.FILTER_TOGGLE_SHOW_MINE
});

export const toggleTabularView = () => ({
	type: actionTypes.FILTER_TOGGLE_TABULAR_VIEW
});

export const setStartDate = (startDate) => {
	return {
		type: actionTypes.FILTER_SET_START_DATE,
		payload: { startDate }
	};
};

export const setEndDate = (endDate) => ({
	type: actionTypes.FILTER_SET_END_DATE,
	payload: { endDate }
});

export const setCalendarFocused = (calendarFocused) => ({
	type: actionTypes.FILTER_SET_CALENDAR_FOCUSED,
	payload: { calendarFocused }
});
