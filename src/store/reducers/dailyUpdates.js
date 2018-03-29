import * as actionTypes from '../actions/actionTypes';
import updateObject from '../utility';

const INITIAL_STATE = {
	dailyUpdates: [],
	loading: false,
	error: false,
	message: ''
};

const fetchDailyUpdatesStart = (state, action) => {
	return updateObject(state, { error: false, loading: true });
};
const fetchDailyUpdatesSuccess = (state, action) => {
	return updateObject(state, { dailyUpdates: action.payload.dailyUpdates, loading: false });
};
const fetchDailyUpdatesFail = (state, action) => {
	return updateObject(state, { loading: false });
};

const submitDailyUpdatesStart = (state, action) => {
	return updateObject(state, { error: false, loading: true, message: '' });
};
const submitDailyUpdatesSuccess = (state, action) => {
	return updateObject(state, { loading: false, message: action.payload.message });
};
const submitDailyUpdatesFail = (state, action) => {
	return updateObject(state, { loading: false, error: action.payload.error });
};

/**
* @param {Object} state - Default application state
* @param {Object} action - Action from action creator
* @returns {Object} New state
*/
export default (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case actionTypes.FETCH_DAILY_UPDATES_START:
			return fetchDailyUpdatesStart(state, action);
		case actionTypes.FETCH_DAILY_UPDATES_SUCCESS:
			return fetchDailyUpdatesSuccess(state, action);
		case actionTypes.FETCH_DAILY_UPDATES_FAIL:
			return fetchDailyUpdatesFail(state, action);

		case actionTypes.SUBMIT_DAILY_UPDATES_START:
			return submitDailyUpdatesStart(state, action);
		case actionTypes.SUBMIT_DAILY_UPDATES_SUCCESS:
			return submitDailyUpdatesSuccess(state, action);
		case actionTypes.SUBMIT_DAILY_UPDATES_FAIL:
			return submitDailyUpdatesFail(state, action);

		default:
			return state;
	}
};
