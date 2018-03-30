import * as actionTypes from '../actions/actionTypes';
import updateObject from '../utility';

const INITIAL_STATE = {
	teamRooms: [],
	loading: false,
	error: false,
	message: ''
};

const fetchTeamRoomsStart = (state, action) => {
	return updateObject(state, { error: false, loading: true });
};
const fetchTeamRoomsSuccess = (state, action) => {
	return updateObject(state, { teamRooms: action.payload.teamRooms, loading: false });
};
const fetchTeamRoomsFail = (state, action) => {
	return updateObject(state, { loading: false, error: action.payload.error });
};

const submitTeamRoomsStart = (state, action) => {
	return updateObject(state, { error: false, loading: true, message: '' });
};
const submitTeamRoomsSuccess = (state, action) => {
	return updateObject(state, { loading: false, message: action.payload.message });
};
const submitTeamRoomsFail = (state, action) => {
	return updateObject(state, { loading: false, error: action.payload.error });
};

/**
* @param {Object} state - Default application state
* @param {Object} action - Action from action creator
* @returns {Object} New state
*/
export default (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case actionTypes.FETCH_TEAM_ROOMS_START:
			return fetchTeamRoomsStart(state, action);
		case actionTypes.FETCH_TEAM_ROOMS_SUCCESS:
			return fetchTeamRoomsSuccess(state, action);
		case actionTypes.FETCH_TEAM_ROOMS_FAIL:
			return fetchTeamRoomsFail(state, action);

		case actionTypes.SUBMIT_TEAM_ROOMS_START:
			return submitTeamRoomsStart(state, action);
		case actionTypes.SUBMIT_TEAM_ROOMS_SUCCESS:
			return submitTeamRoomsSuccess(state, action);
		case actionTypes.SUBMIT_TEAM_ROOMS_FAIL:
			return submitTeamRoomsFail(state, action);

		default:
			return state;
	}
};
